import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';

// RevenueCat setup (create these in the dashboard before TestFlight):
//  Entitlement "pro"            -> yearly + monthly subscriptions (offering "default", shown with RevenueCat's own paywall)
//  Entitlement "report_buyer"   -> granted on first Name Report purchase (promotional, lifetime)
//  Offering "name_report"       -> one package, product "ank_name_report" (Complete Report): Rs 499 India, $9.99 rest of world
export const ENT_PRO = 'pro';
export const ENT_BUYER = 'report_buyer';
export const OFFERING_NAME_REPORT = 'name_report';

const KEYS = { ios: process.env.EXPO_PUBLIC_RC_IOS_KEY ?? 'appl_zRLFuqSZdmZsDPLrvakpgAPnzfI', android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY ?? 'goog_AErLeQiGkHfNxsCLupBebXnOxCg' };
let configured = false;

export function initPurchases(appUserId?: string) {
  const apiKey = Platform.OS === 'ios' ? KEYS.ios : KEYS.android;
  if (!apiKey) return false; // not configured yet (no key in this build)
  if (configured) return true;
  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);
  Purchases.configure({ apiKey, appUserID: appUserId });
  configured = true;
  return true;
}

export const purchasesReady = () => configured;
export const getAppUserId = async () => (configured ? Purchases.getAppUserID() : '');
let identityTail: Promise<unknown> = Promise.resolve();
export function connectPurchaseAccount(id: string) {
  const run = identityTail.then(async () => {
    if (!initPurchases()) throw new Error('Purchases are unavailable in this build.');
    const previous = await Purchases.getAppUserID();
    const result = await Purchases.logIn(id);
    if (await Purchases.getAppUserID() !== id) throw new Error('Purchase sign-in did not finish. Try again.');
    return { previous, ent: entitlementsFrom(result.customerInfo) };
  });
  identityTail = run.catch(() => {}); return run;
}
export function disconnectPurchaseAccount() {
  const run = identityTail.then(async () => {
    if (configured && !(await Purchases.isAnonymous())) await Purchases.logOut();
  });
  identityTail = run.catch(() => {}); return run;
}

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

/** Store-localised price of the Complete Report: Rs 499 in India, $9.99 elsewhere (set per territory in App Store Connect). */
export async function reportPrice(fallback: string): Promise<string> {
  if (!configured) return fallback;
  try { const o = await Purchases.getOfferings(); return o.all[OFFERING_NAME_REPORT]?.availablePackages[0]?.product.priceString ?? fallback; } catch { return fallback; }
}

/** RevenueCat's own paywall for the Pro plans. Returns true when the user bought or restored. */
export async function showProPaywall(): Promise<boolean> {
  if (!configured) return false;
  await RevenueCatUI.presentPaywallIfNeeded({ requiredEntitlementIdentifier: ENT_PRO });
  return entitlementsFrom(await Purchases.getCustomerInfo()).pro;
}
