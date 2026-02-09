import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
   const dispatch = useDispatch();
   const { i18n } = useTranslation();

   return (
      <header className="h-14 bg-white border-b flex items-center justify-end px-4">
         <button
            onClick={() => dispatch(logout())}
            className="text-sm text-red-600"
         >
            Logout
         </button>
         <button
            onClick={() =>
               i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
            }
            className="text-sm"
         >
            {i18n.language === 'en' ? 'AR' : 'EN'}
         </button>
      </header>
   );
}
