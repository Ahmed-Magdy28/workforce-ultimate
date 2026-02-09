import type { AuthState } from '@/types/auth';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export const AuthInitialState: AuthState = {
   isAuthenticated: false,
   role: 'GUEST',
   userId: null,
   session: null,
};
