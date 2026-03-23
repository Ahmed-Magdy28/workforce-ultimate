import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { useTranslation } from 'react-i18next';
import { applyThemeToDOM } from '@/features/theme/themeSlice';

export default function GlobalEffects() {
   const { i18n } = useTranslation();
   const { theme } = useSelector((state: RootState) => state.theme);

   /* -------------------- */
   /* Apply theme to <html> */
   /* -------------------- */
   useEffect(() => {
      applyThemeToDOM(theme);
   }, [theme]);

   /* -------------------- */
   /* RTL + lang handling */
   /* -------------------- */
   useEffect(() => {
      document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';

      document.documentElement.lang = i18n.language;
   }, [i18n.language]);

   return null;
}
