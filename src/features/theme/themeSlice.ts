// themeSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark';

interface ThemeState {
   theme: Theme;
   isManual: boolean; // did user explicitly choose?
}

// --- Safe theme validator ---
const isValidTheme = (value: string | null): value is Theme =>
   value === 'light' || value === 'dark';

// --- Detect system preference safely ---
const getSystemTheme = (): Theme => {
   if (typeof window === 'undefined') return 'light';

   return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
};

// --- Get initial theme ---
const getInitialTheme = (): ThemeState => {
   if (typeof window === 'undefined') {
      return { theme: 'light', isManual: false };
   }

   const savedTheme = localStorage.getItem('theme');

   if (isValidTheme(savedTheme)) {
      return { theme: savedTheme, isManual: true };
   }

   return { theme: getSystemTheme(), isManual: false };
};

const initialState: ThemeState = getInitialTheme();

const themeSlice = createSlice({
   name: 'theme',
   initialState,
   reducers: {
      toggleTheme(state) {
         state.theme = state.theme === 'light' ? 'dark' : 'light';
         state.isManual = true;

         localStorage.setItem('theme', state.theme);
         applyThemeToDOM(state.theme);
      },

      setTheme(state, action: PayloadAction<Theme>) {
         state.theme = action.payload;
         state.isManual = true;

         localStorage.setItem('theme', state.theme);
         applyThemeToDOM(state.theme);
      },

      // Used only for system auto-update
      setSystemTheme(state, action: PayloadAction<Theme>) {
         if (!state.isManual) {
            state.theme = action.payload;
            applyThemeToDOM(state.theme);
         }
      },
   },
});

export const { toggleTheme, setTheme, setSystemTheme } = themeSlice.actions;

export default themeSlice.reducer;

/* -------------------------------- */
/* DOM Theme Applier (single source) */
/* -------------------------------- */

export const applyThemeToDOM = (theme: Theme) => {
   if (typeof document === 'undefined') return;

   document.documentElement.classList.remove('light', 'dark');
   document.documentElement.classList.add(theme);
};
