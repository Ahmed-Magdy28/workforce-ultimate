// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

//TODO: add every namespace you have here
const namespaces = [
   'common',
   'landing',
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

i18n
   .use(HttpBackend)
   .use(LanguageDetector)
   .use(initReactI18next)
   .init({
      fallbackLng: 'en',
      supportedLngs: ['en', 'ar'],

      // Default namespace when no namespace is specified
      defaultNS: 'common',

      // Tell i18next these are all valid namespaces
      ns: namespaces,

      // Preload ALL namespaces on startup (so t() works globally)
      preload: ['en', 'ar'], // ← important: preload both languages
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
export default i18n;
