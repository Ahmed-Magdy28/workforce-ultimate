export function isSupabaseNetworkError(error: unknown): boolean {
   if (!error) return false;

   const message =
      typeof error === 'string'
         ? error
         : error instanceof Error
           ? error.message
           : JSON.stringify(error);

   const lower = message.toLowerCase();

   return (
      lower.includes('failed to fetch') ||
      lower.includes('network error') ||
      lower.includes('networkrequestfailed') ||
      lower.includes('connection refused') ||
      lower.includes('connection error') ||
      lower.includes('load failed') ||
      lower.includes('timeout') ||
      lower.includes('aborterror') ||
      lower.includes('502') ||
      lower.includes('503') ||
      lower.includes('504')
   );
}

export function formatAuthError(
   error: unknown,
   defaultMessage = 'An unexpected error occurred',
): string {
   if (isSupabaseNetworkError(error)) {
      return 'Unable to connect to the server. Please check your internet connection or try again later.';
   }

   if (error instanceof Error) {
      if (error.message.includes('Invalid login credentials')) {
         return 'Invalid email or password.';
      }
      if (error.message.includes('Email not confirmed')) {
         return 'Your email has not been verified yet. Please check your inbox for the confirmation link.';
      }
      if (error.message.includes('User already registered')) {
         return 'An account with this email address already exists.';
      }
      return error.message;
   }

   return defaultMessage;
}
