import { useSelector } from 'react-redux';
import type { RootState } from './app/store';
import AppRoutes from './routes/router';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function App() {
   const theme = useSelector((state: RootState) => state.theme.theme);

   const { i18n } = useTranslation();

   useEffect(() => {
      document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
   }, [i18n.language]);

   return (
      <div className={theme === 'dark' ? 'dark' : ''}>
         <AppRoutes />
      </div>
   );
}
