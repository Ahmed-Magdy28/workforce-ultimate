import * as React from 'react';
import { cn } from '@/lib/utils';

export type CountryItem = {
   code: string;
   name: string;
   flag: string;
   dialCode: string;
};

export const COUNTRIES: CountryItem[] = [
   { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
   { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
   { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
   { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965' },
   { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974' },
   { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973' },
   { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968' },
   { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962' },
   { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961' },
   { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
   { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
   { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
   { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
   { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
   { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
   { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
   { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
   { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92' },
   { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
   { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
   { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
   { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
   { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
   { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
   { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
   { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
   { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
   { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
   { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
   { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60' },
];

export function getCountryFlag(countryNameOrCode?: string | null): string {
   if (!countryNameOrCode) return '🌐';
   const clean = countryNameOrCode.trim().toLowerCase();
   const found = COUNTRIES.find(
      (c) =>
         c.code.toLowerCase() === clean ||
         c.name.toLowerCase() === clean ||
         clean.includes(c.name.toLowerCase()),
   );
   return found ? found.flag : '🌐';
}

type CountrySelectProps = React.ComponentProps<'select'> & {
   placeholder?: string;
};

const baseSelectClassName =
   'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20';

const CountrySelect = React.forwardRef<HTMLSelectElement, CountrySelectProps>(
   ({ className, placeholder = 'Select country of origin', ...props }, ref) => {
      return (
         <select
            ref={ref}
            className={cn(baseSelectClassName, className)}
            {...props}
         >
            <option value="">{placeholder}</option>
            {COUNTRIES.map((country) => (
               <option key={country.code} value={country.name}>
                  {country.flag} {country.name} ({country.code})
               </option>
            ))}
         </select>
      );
   },
);

CountrySelect.displayName = 'CountrySelect';

export { CountrySelect };
