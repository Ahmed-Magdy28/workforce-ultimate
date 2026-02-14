import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { Globe, Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { toggleTheme } from '@/features/theme/themeSlice';
import { useEffect } from 'react';

export function PublicHeader() {
   const { i18n, t } = useTranslation();
   const location = useLocation();
   const theme = useAppSelector((state) => state.theme.theme);
   const dispatch = useAppDispatch();
   const isAuthPage =
      location.pathname === '/login' || location.pathname === '/signup';

   // Apply theme to document
   useEffect(() => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
   }, [theme]);
   const handleThemeToggle = () => {
      dispatch(toggleTheme());
   };

   return (
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
         <div className="mx-auto flex h-16 max-w-360  md:text-3xl items-center justify-between px-4  sm:px-6 lg:px-8">
            {/* Logo */}
            <Link
               to="/"
               className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
               <img
                  src="/assets/icons/logo.png"
                  className="h-15 w-15 object-contain"
                  alt="Workforce Ultimate Logo"
               />
               <span className="text-lg font-semibold tracking-tight sm:text-2xl">
                  {t('Workforce Ultimate')}
               </span>
            </Link>

            {/* Navigation & Actions */}
            <div className="flex items-center gap-3">
               {/* Auth Buttons - conditional based on current page */}
               {!isAuthPage && (
                  <div className="flex items-center gap-2 sm:text-4xl">
                     <Button variant="ghost" asChild>
                        <Link className="sm:text-base" to="/login">
                           {t('login', 'Login')}
                        </Link>
                     </Button>
                     <Button asChild>
                        <Link className="sm:text-base" to="/signup">
                           {t('signup', 'Sign Up')}
                        </Link>
                     </Button>
                  </div>
               )}

               {/* Theme Toggle */}
               <Button
                  variant="outline"
                  size="icon"
                  onClick={handleThemeToggle}
                  className="h-9 w-9"
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

               {/* Language Switcher */}
               <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                     i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')
                  }
                  className="h-9 w-9"
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
