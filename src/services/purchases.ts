import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

// RevenueCat setup (create these in the dashboard before TestFlight):
//  Entitlement "pro"            -> yearly + monthly subscriptions (offering "default", shown with RevenueCat's own paywall)
//  Entitlement "report_buyer"   -> granted on first Name Report purchase (promotional, lifetime)
//  Offering "name_report"       -> one package, consumable product "ank_name_report" ($9.99)
export const ENT_PRO = 'pro';
export const ENT_BUYER = 'report_buyer';
export const OFFERING_NAME_REPORT = 'name_report';

const KEYS = { ios: process.env.EXPO_PUBLIC_RC_IOS_KEY ?? '', android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? '' };
let configured = false;

export function initPurchases(appUserId?: string) {
  const apiKey = Platform.OS === 'ios' ? KEYS.ios : KEYS.android;
  if (!apiKey) return false; // not configured yet (no key in this build)
  if (configured) return true;
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
  Purchases.configure({ apiKey, appUserID: appUserId });
  configured = true;
  // Apple Search Ads attribution, no user prompt needed.
  if (Platform.OS === 'ios') void Purchases.enableAdServicesAttributionTokenCollection();
  return true;
}

/** Calls cb whenever RevenueCat reports a change (purchase, renewal, expiry, refund) so the app never shows stale Pro state. */
export function onEntitlementsChange(cb: (e: { pro: boolean; reportBuyer: boolean }) => void): () => void {
  if (!configured) return () => {};
  const listener = (info: CustomerInfo) => cb(entitlementsFrom(info));
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => { Purchases.removeCustomerInfoUpdateListener(listener); };
}

/** RevenueCat Customer Center: manage or cancel, refund requests, support. */
export async function openCustomerCenter(): Promise<void> {
  if (!configured) return;
  try { await RevenueCatUI.presentCustomerCenter(); } catch { /* not available in this build */ }
}

export const purchasesReady = () => configured;

export function entitlementsFrom(info: CustomerInfo) {
  return { pro: !!info.entitlements.active[ENT_PRO], reportBuyer: !!info.entitlements.active[ENT_BUYER] };
}

export async function refreshEntitlements() {
  if (!configured) return null;
  return entitlementsFrom(await Purchases.getCustomerInfo());
}

export async function restore() {
  if (!configured) return null;
  return entitlementsFrom(await Purchases.restorePurchases());
}

export type BuyResult = { ok: true } | { ok: false; cancelled: boolean; message?: string };

export async function buyNameReport(profileId: string, email: string): Promise<BuyResult> {
  if (!configured) return { ok: false, cancelled: false, message: 'Purchases are not set up in this build.' };
  try {
    const offerings = await Purchases.getOfferings();
    const pkg: PurchasesPackage | undefined = offerings.all[OFFERING_NAME_REPORT]?.availablePackages[0];
    if (!pkg) return { ok: false, cancelled: false, message: 'The Name Report is not available right now. Please try again later.' };
    await Purchases.setAttributes({ email, name_report_profile: profileId });
    await Purchases.purchasePackage(pkg);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, cancelled: !!e?.userCancelled, message: e?.userCancelled ? undefined : (e?.message ?? 'Purchase failed') };
  }
}

/** RevenueCat's own paywall for the Pro plans. Returns true when the user bought or restored. */
export async function showProPaywall(): Promise<boolean> {
  if (!configured) return false;
  const r = await RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: ENT_PRO });
  return r === PAYWALL_RESULT.PURCHASED || r === PAYWALL_RESULT.RESTORED || r === PAYWALL_RESULT.NOT_PRESENTED;
}
