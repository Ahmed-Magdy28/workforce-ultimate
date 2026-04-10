import * as React from 'react';

import { cn } from '@/lib/utils';

const industryOptions = [
   'Accounting',
   'Advertising',
   'Agriculture',
   'Automotive',
   'Banking',
   'Biotechnology',
   'Construction',
   'Consulting',
   'Consumer Goods',
   'Education',
   'Energy',
   'Engineering',
   'Entertainment',
   'Fashion',
   'Financial Services',
   'Food and Beverage',
   'Government',
   'Healthcare',
   'Hospitality',
   'Human Resources',
   'Insurance',
   'Legal',
   'Logistics',
   'Manufacturing',
   'Marketing',
   'Media',
   'Nonprofit',
   'Pharmaceuticals',
   'Real Estate',
   'Retail',
   'Security',
   'Software',
   'Sports',
   'Telecommunications',
   'Transportation',
   'Travel',
   'Utilities',
   'Other',
] as const;

type IndustrySelectProps = React.ComponentProps<'select'> & {
   placeholder?: string;
};

const baseSelectClassName =
   'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20';

const IndustrySelect = React.forwardRef<HTMLSelectElement, IndustrySelectProps>(
   ({ className, placeholder = 'Select an industry', ...props }, ref) => {
      return (
         <select
            ref={ref}
            className={cn(baseSelectClassName, className)}
            {...props}
         >
            <option value="">{placeholder}</option>
            {industryOptions.map((industry) => (
               <option key={industry} value={industry}>
                  {industry}
               </option>
            ))}
         </select>
      );
   },
);

IndustrySelect.displayName = 'IndustrySelect';

export { IndustrySelect };
