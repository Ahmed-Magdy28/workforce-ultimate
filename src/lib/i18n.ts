import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const namespaces = [
   'common',
   'landing',
   'landingpage',
   'about',
   'roadmap',
   '404',
   'career',
   'blog',
   'contact',
   'docs',
   'api',
   'support',
   'community',
   'privacy',
   'terms',
   'cookie',
   'security',
];

if (typeof window !== 'undefined') {
   i18n.use(HttpBackend).use(LanguageDetector).use(initReactI18next);
} else {
   i18n.use(initReactI18next);
}

if (!i18n.isInitialized) {
   i18n.init({
      fallbackLng: 'en',
      supportedLngs: ['en', 'ar'],
      defaultNS: 'common',
      ns: namespaces,
      preload: typeof window !== 'undefined' ? ['en', 'ar'] : [],
      backend: {
         loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      react: {
         useSuspense: false,
      },
      interpolation: {
         escapeValue: false,
      },
      debug: false,
   });
}

export default i18n;
