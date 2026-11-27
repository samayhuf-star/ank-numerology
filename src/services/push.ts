// OneSignal remote push for optional tips. Daily numbers stay local (expo-notifications).
// Consent is required before OneSignal sends or collects anything: the user opts in with
// "Name Report tips and offers" (onboarding or Settings); the choice lives in the app store (s.notif.tips).
import { OneSignal } from 'react-native-onesignal';

const APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;
let started = false;

export function initPush(consent: boolean) {
  if (!APP_ID) return;
  try {
    if (!started) { OneSignal.setConsentRequired(true); OneSignal.initialize(APP_ID); started = true; }
    OneSignal.setConsentGiven(consent);
  } catch { /* push is optional */ }
}

export const setPushConsent = (consent: boolean) => initPush(consent);
