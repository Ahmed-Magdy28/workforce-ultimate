import * as React from 'react';

import { cn } from '@/lib/utils';

type TimezoneSelectProps = React.ComponentProps<'select'> & {
   placeholder?: string;
};

const fallbackTimeZones = [
   'UTC',
   'Africa/Cairo',
   'Africa/Johannesburg',
   'America/Chicago',
   'America/Los_Angeles',
   'America/New_York',
   'Asia/Dubai',
   'Asia/Riyadh',
   'Asia/Tokyo',
   'Europe/Berlin',
   'Europe/London',
   'Europe/Paris',
] as const;

const timeZoneValues =
   typeof Intl.supportedValuesOf === 'function'
      ? Intl.supportedValuesOf('timeZone')
      : [...fallbackTimeZones];

const timezoneOptions = Array.from(new Set(['UTC', ...timeZoneValues])).sort(
   (left, right) => left.localeCompare(right),
);

const baseSelectClassName =
   'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20';

function getUtcOffsetLabel(timezone: string) {
   if (timezone === 'UTC') return 'UTC+00:00';

   try {
      const formatter = new Intl.DateTimeFormat('en-US', {
         timeZone: timezone,
         timeZoneName: 'shortOffset',
      });
      const timeZoneNamePart = formatter
         .formatToParts(new Date())
         .find((part) => part.type === 'timeZoneName')?.value;

      if (!timeZoneNamePart) return 'UTC';

      const normalizedOffset = timeZoneNamePart.replace('GMT', 'UTC');
      return normalizedOffset.includes(':')
         ? normalizedOffset
         : normalizedOffset.replace(/([+-]\d{1,2})$/, '$1:00');
   } catch {
      return 'UTC';
   }
}

function formatTimezoneLabel(value: string) {
   const parts = value.split('/');
   const city = parts[parts.length - 1]?.replaceAll('_', ' ') ?? value;
   return `${city} (${getUtcOffsetLabel(value)})`;
}

const TimezoneSelect = React.forwardRef<HTMLSelectElement, TimezoneSelectProps>(
   ({ className, placeholder = 'Select a timezone', ...props }, ref) => {
      return (
         <select
            ref={ref}
            className={cn(baseSelectClassName, className)}
            {...props}
         >
            <option value="">{placeholder}</option>
            {timezoneOptions.map((timezone) => (
               <option key={timezone} value={timezone}>
                  {formatTimezoneLabel(timezone)}
               </option>
            ))}
         </select>
      );
   },
);

TimezoneSelect.displayName = 'TimezoneSelect';

export { TimezoneSelect };
