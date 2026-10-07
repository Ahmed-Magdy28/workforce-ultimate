import * as React from 'react';
import { cn } from '@/lib/utils';

type TimezoneSelectProps = React.ComponentProps<'select'> & {
   placeholder?: string;
};

export function detectBrowserTimezone(): string {
   try {
      if (typeof window !== 'undefined' && window.Intl) {
         return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Cairo';
      }
   } catch {
      // Fallback
   }
   return 'Africa/Cairo';
}

const featuredTimeZones = [
   { value: 'Africa/Cairo', label: '🇪🇬 Egypt (Cairo - UTC+02:00)' },
   { value: 'Asia/Riyadh', label: '🇸🇦 Saudi Arabia (Riyadh - UTC+03:00)' },
   { value: 'Asia/Dubai', label: '🇦🇪 UAE (Dubai - UTC+04:00)' },
   { value: 'Asia/Kuwait', label: '🇰🇼 Kuwait (UTC+03:00)' },
   { value: 'Asia/Qatar', label: '🇶🇦 Qatar (UTC+03:00)' },
   { value: 'Asia/Amman', label: '🇯🇴 Jordan (Amman - UTC+03:00)' },
   { value: 'Europe/London', label: '🇬🇧 UK (London - UTC+00:00 / +01:00)' },
   { value: 'Europe/Paris', label: '🇫🇷 France (Paris - UTC+01:00 / +02:00)' },
   { value: 'Europe/Berlin', label: '🇩🇪 Germany (Berlin - UTC+01:00 / +02:00)' },
   { value: 'America/New_York', label: '🇺🇸 US Eastern (New York - UTC-05:00)' },
   { value: 'America/Chicago', label: '🇺🇸 US Central (Chicago - UTC-06:00)' },
   { value: 'America/Los_Angeles', label: '🇺🇸 US Pacific (Los Angeles - UTC-08:00)' },
   { value: 'UTC', label: '🌐 UTC (Universal Coordinated Time)' },
];

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

const allTimezoneOptions = Array.from(new Set(['UTC', 'Africa/Cairo', ...timeZoneValues])).sort(
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
   if (value === 'Africa/Cairo') {
      return '🇪🇬 Egypt / Cairo (UTC+02:00)';
   }
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
            <optgroup label="Popular & Regional (Egypt +2, Gulf, Europe, US)">
               {featuredTimeZones.map((tz) => (
                  <option key={`featured-${tz.value}`} value={tz.value}>
                     {tz.label}
                  </option>
               ))}
            </optgroup>
            <optgroup label="All Global Timezones">
               {allTimezoneOptions.map((timezone) => (
                  <option key={timezone} value={timezone}>
                     {formatTimezoneLabel(timezone)}
                  </option>
               ))}
            </optgroup>
         </select>
      );
   },
);

TimezoneSelect.displayName = 'TimezoneSelect';

export { TimezoneSelect };
