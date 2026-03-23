import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { Globe, Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleTheme } from '@/features/theme/themeSlice';

export function PublicHeader() {
   const { i18n, t } = useTranslation();
   const location = useLocation();
   const theme = useAppSelector((state) => state.theme.theme);
   const dispatch = useAppDispatch();
   const isAuthPage =
      location.pathname === '/login' || location.pathname === '/signup';

   const handleThemeToggle = () => {
      dispatch(toggleTheme());
   };

   return (
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
         <div className="mx-auto flex min-h-16 w-full max-w-screen-2xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
            <Link
               to="/"
               className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3"
            >
               <img
                  src="/assets/icons/logo.png"
                  className="h-15 w-15 shrink-0 object-contain sm:h-10 sm:w-10"
                  alt="Workforce Ultimate Logo"
               />
               <span className="max-w-36 truncate text-sm font-semibold tracking-tight sm:max-w-none sm:text-lg md:text-xl">
                  {t('Workforce Ultimate')}
               </span>
            </Link>

            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
               {!isAuthPage && (
                  <div className="flex items-center gap-2">
                     <Button variant="ghost" size="sm" asChild>
                        <Link to="/login">{t('login', 'Login')}</Link>
                     </Button>
                     <Button size="sm" asChild>
                        <Link to="/signup">{t('signup', 'Sign Up')}</Link>
                     </Button>
                  </div>
               )}

               <Button
                  variant="outline"
                  size="icon"
                  onClick={handleThemeToggle}
                  className="h-9 w-9 shrink-0"
                  aria-label="Toggle theme"
               >
                  {theme === 'light' ? (
                     <Moon className="h-4 w-4" />
                  ) : (
                     <Sun className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                     {theme === 'light'
                        ? t('theme.switchToDark', 'Switch to dark mode')
                        : t('theme.switchToLight', 'Switch to light mode')}
                  </span>
               </Button>

               <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                     i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
                  }
                  className="h-9 w-9 shrink-0"
                  aria-label="Switch language"
               >
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">
                     {i18n.language === 'en' ? 'العربية' : 'English'}
                  </span>
               </Button>
            </div>
         </div>
      </header>
   );
}
