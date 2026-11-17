export const CONFIG = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',            // Complete Report backend (PDF + email); see report-api/DEPLOY.md
  privacyUrl: process.env.EXPO_PUBLIC_PRIVACY_URL ?? 'https://klenzer.online/ank-numerology/privacy/', // TODO: real URL before submission
  termsUrl: process.env.EXPO_PUBLIC_TERMS_URL ?? 'https://klenzer.online/ank-numerology/terms/',       // TODO: real URL before submission
  supportEmail: 'samayhuf@gmail.com',
  supportUrl: 'https://klenzer.online/ank-numerology/support/',
};
