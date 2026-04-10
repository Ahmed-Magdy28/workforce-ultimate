import { CalendarDays, FileText, TimerReset } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';

const plannerHighlights = [
   {
      icon: CalendarDays,
      title: 'Manage events',
      description:
         'Bring your schedule into one place so meetings and work sessions stay visible.',
   },
   {
      icon: TimerReset,
      title: 'Time block your work',
      description:
         'Reserve time for focused execution instead of reacting to the day as it happens.',
   },
   {
      icon: FileText,
      title: 'Take meeting notes',
      description:
         'Keep notes close to the event itself so follow-ups are easier to track later.',
   },
];

export default function PlannerPage() {
   return (
      <section className="space-y-6">
         <Card className="border-primary/15 bg-linear-to-br from-primary/8 via-background to-background shadow-sm">
            <CardHeader className="space-y-4">
               <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Planner
               </div>
               <div className="max-w-3xl space-y-3">
                  <CardTitle className="text-3xl leading-tight sm:text-4xl">
                     Your time, but better organized.
                  </CardTitle>
                  <CardDescription className="text-base leading-7 sm:text-lg">
                     Connect your calendar to manage events, time block your
                     work, and take meeting notes, powered by Workforce
                     Ultimate.
                  </CardDescription>
               </div>
            </CardHeader>

            <CardContent className="grid gap-4 lg:grid-cols-3">
               {plannerHighlights.map(({ icon: Icon, title, description }) => (
                  <div
                     key={title}
                     className="rounded-2xl border border-border/70 bg-background/80 p-5"
                  >
                     <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 text-primary">
                        <Icon className="size-5" />
                     </div>
                     <h3 className="text-base font-semibold">{title}</h3>
                     <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {description}
                     </p>
                  </div>
               ))}
            </CardContent>
         </Card>

         <Card className="shadow-sm">
            <CardHeader className="space-y-2">
               <CardTitle className="text-2xl">Get started with</CardTitle>
               <CardDescription className="text-sm sm:text-base">
                  Pick the calendar provider you already use. We can wire the
                  actual connection flow next.
               </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 sm:flex-row">
               <Button size="lg" className="w-full sm:w-auto">
                  Google Calendar
               </Button>
               <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Microsoft Outlook
               </Button>
            </CardContent>
         </Card>
      </section>
   );
}
