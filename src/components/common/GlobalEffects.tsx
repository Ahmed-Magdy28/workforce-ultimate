import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { applyThemeToDOM, setSystemTheme } from '@/features/theme/themeSlice';

export default function GlobalEffects() {
   const dispatch = useDispatch();
   const { i18n } = useTranslation();
   const { theme } = useSelector((state: RootState) => state.theme);

   /* -------------------- */
   /* Apply theme to <html> */
   /* -------------------- */
   useEffect(() => {
      applyThemeToDOM(theme);
   }, [theme]);

   /* -------------------- */
   /* Listen to system change */
   /* -------------------- */
   useEffect(() => {
      const media = window.matchMedia('(prefers-color-scheme: dark)');

      const handler = (e: MediaQueryListEvent) => {
         dispatch(setSystemTheme(e.matches ? 'dark' : 'light'));
      };

      media.addEventListener('change', handler);

      return () => {
         media.removeEventListener('change', handler);
      };
   }, [dispatch]);

   /* -------------------- */
   /* RTL + lang handling */
   /* -------------------- */
   useEffect(() => {
      document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

      document.documentElement.lang = i18n.language;
   }, [i18n.language]);

   return null;
}
