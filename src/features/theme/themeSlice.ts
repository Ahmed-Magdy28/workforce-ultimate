import { createSlice } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

interface ThemeState {
   theme: Theme;
}

// Get initial theme from localStorage or system preference
const getInitialTheme = (): Theme => {
   const savedTheme = localStorage.getItem('theme') as Theme;
   if (savedTheme) {
      return savedTheme;
   }

   // Check system preference
   if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
   }

   return 'light';
};

const initialState: ThemeState = {
   theme: getInitialTheme(),
};

const themeSlice = createSlice({
   name: 'theme',
   initialState,
   reducers: {
      toggleTheme(state) {
         state.theme = state.theme === 'light' ? 'dark' : 'light';
         localStorage.setItem('theme', state.theme);
         document.documentElement.classList.remove('light', 'dark');
         document.documentElement.classList.add(state.theme);
      },
      setTheme(state, action) {
         state.theme = action.payload;
         localStorage.setItem('theme', state.theme);
         document.documentElement.classList.remove('light', 'dark');
         document.documentElement.classList.add(state.theme);
      },
   },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
