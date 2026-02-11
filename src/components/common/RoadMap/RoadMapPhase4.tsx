import { useTranslation } from 'react-i18next';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from '@/components/ui/accordion';
import {
   CheckCircle2,
   Smartphone,
   Zap,
   Database,
   Clock,
   BarChart3,
   ArrowRight,
   Target,
   Rocket,
   FileText,
} from 'lucide-react';
import type { JSX } from 'react';

export default function RoadMapPhase4() {
   const { t } = useTranslation();

   type TaskStatus = 'completed' | 'in-progress' | 'pending';
   type CategoryTask = {
      name: string;
      description: string;
      status: TaskStatus;
   };
   type Category = {
      title: string;
      description: string;
      icon: JSX.Element;
      color: string;
      bgColor: string;
      tasks: CategoryTask[];
   };

   const categories: Category[] = [
      {
         title: t('roadmap.phase4.pwa.title', 'Progressive Web App (PWA)'),
         description: t(
            'roadmap.phase4.pwa.description',
            'Make the app installable, work offline, and support push notifications',
         ),
         icon: <Smartphone className="h-5 w-5" />,
         color: 'text-blue-500',
         bgColor: 'bg-blue-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase4.pwa.manifest',
                  'Web App Manifest + Icons',
               ),
               description: t(
                  'roadmap.phase4.pwa.manifestDesc',
                  'manifest.json, 192×192 and 512×512 icons, theme color, display: standalone',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.pwa.serviceworker',
                  'Service Worker Registration',
               ),
               description: t(
                  'roadmap.phase4.pwa.serviceworkerDesc',
                  'Vite PWA plugin or Workbox – caching static assets',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.pwa.offline',
                  'Offline Fallback & Basic Offline Mode',
               ),
               description: t(
                  'roadmap.phase4.pwa.offlineDesc',
                  'Offline page / cached dashboard view + toast when offline',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.pwa.push',
                  'Push Notifications (Web Push)',
               ),
               description: t(
                  'roadmap.phase4.pwa.pushDesc',
                  'Permission prompt, subscription to Supabase + VAPID keys, send from server',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase4.performance.title',
            'Performance Optimization',
         ),
         description: t(
            'roadmap.phase4.performance.description',
            'Reduce load times, improve Core Web Vitals and perceived speed',
         ),
         icon: <Zap className="h-5 w-5" />,
         color: 'text-yellow-500',
         bgColor: 'bg-yellow-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase4.performance.lazy',
                  'Lazy Loading + Code Splitting',
               ),
               description: t(
                  'roadmap.phase4.performance.lazyDesc',
                  'React.lazy + Suspense for routes, heavy components (charts, org chart)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.performance.images',
                  'Image Optimization',
               ),
               description: t(
                  'roadmap.phase4.performance.imagesDesc',
                  'Next-gen formats (webp/avif), responsive sizes, lazy loading, blur placeholders',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.performance.vitals',
                  'Core Web Vitals Monitoring',
               ),
               description: t(
                  'roadmap.phase4.performance.vitalsDesc',
                  'CLS, LCP, FID/INP tracking (Vercel Analytics / Sentry / LogRocket)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.performance.bundle',
                  'Bundle Size Audit & Reduction',
               ),
               description: t(
                  'roadmap.phase4.performance.bundleDesc',
                  'Analyze with vite-bundle-visualizer, remove heavy deps, tree-shaking',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase4.caching.title', 'Caching Strategy'),
         description: t(
            'roadmap.phase4.caching.description',
            'Intelligent data fetching and storage to minimize API calls',
         ),
         icon: <Database className="h-5 w-5" />,
         color: 'text-indigo-500',
         bgColor: 'bg-indigo-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase4.caching.query',
                  'TanStack Query Advanced Caching',
               ),
               description: t(
                  'roadmap.phase4.caching.queryDesc',
                  'staleTime, cacheTime, refetchOnWindowFocus, background refetch',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.caching.persist',
                  'Persist Query Cache (localStorage / IndexedDB)',
               ),
               description: t(
                  'roadmap.phase4.caching.persistDesc',
                  'persistQueryClient + async storage for offline + faster reloads',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.caching.supabase',
                  'Supabase Edge Functions Caching',
               ),
               description: t(
                  'roadmap.phase4.caching.supabaseDesc',
                  'Cache expensive reports / aggregates for 5–60 minutes',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase4.jobs.title', 'Background Jobs & Queues'),
         description: t(
            'roadmap.phase4.jobs.description',
            'Offload heavy / time-consuming tasks from the main request cycle',
         ),
         icon: <Clock className="h-5 w-5" />,
         color: 'text-purple-500',
         bgColor: 'bg-purple-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase4.jobs.bulk',
                  'Bulk Operations (CSV Import, Email Batch)',
               ),
               description: t(
                  'roadmap.phase4.jobs.bulkDesc',
                  'Queue long-running imports / bulk notifications',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.jobs.reminders',
                  'Scheduled Reminders & Reports',
               ),
               description: t(
                  'roadmap.phase4.jobs.remindersDesc',
                  'Daily/weekly cron-like jobs (Supabase Edge / pg_cron / external scheduler)',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase4.jobs.audit', 'Async Audit Log Writes'),
               description: t(
                  'roadmap.phase4.jobs.auditDesc',
                  'Fire-and-forget logging to prevent slowing down user actions',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase4.reporting.title',
            'Advanced Reporting & Exports',
         ),
         description: t(
            'roadmap.phase4.reporting.description',
            'Powerful, customizable reports with better export options',
         ),
         icon: <BarChart3 className="h-5 w-5" />,
         color: 'text-emerald-500',
         bgColor: 'bg-emerald-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase4.reporting.custom',
                  'Custom Report Builder (Basic)',
               ),
               description: t(
                  'roadmap.phase4.reporting.customDesc',
                  'Select metrics, filters, date range, group by → table/chart view',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase4.reporting.pdf', 'PDF Report Generation'),
               description: t(
                  'roadmap.phase4.reporting.pdfDesc',
                  'jsPDF / pdfmake / puppeteer → styled PDF exports',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.reporting.scheduled',
                  'Scheduled Report Delivery',
               ),
               description: t(
                  'roadmap.phase4.reporting.scheduledDesc',
                  'Email PDF/CSV reports weekly/monthly to managers/HR',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase4.reporting.dashboard',
                  'Advanced Dashboard Widgets',
               ),
               description: t(
                  'roadmap.phase4.reporting.dashboardDesc',
                  'Drill-down, time comparisons, export per widget',
               ),
               status: 'pending' as const,
            },
         ],
      },
   ];

   const getStatusBadge = (status: TaskStatus) => {
      const statusConfig = {
         completed: {
            label: t('roadmap.status.completed', 'Completed'),
            variant: 'default' as const,
            icon: <CheckCircle2 className="h-3 w-3" />,
         },
         'in-progress': {
            label: t('roadmap.status.inProgress', 'In Progress'),
            variant: 'secondary' as const,
            icon: <ArrowRight className="h-3 w-3" />,
         },
         pending: {
            label: t('roadmap.status.pending', 'Pending'),
            variant: 'outline' as const,
            icon: <Target className="h-3 w-3" />,
         },
      };

      const config = statusConfig[status];
      return (
         <Badge variant={config.variant} className="flex items-center gap-1">
            {config.icon}
            {config.label}
         </Badge>
      );
   };

   const calculateProgress = () => {
      const totalTasks = categories.reduce(
         (sum, cat) => sum + cat.tasks.length,
         0,
      );
      const completedTasks = categories.reduce(
         (sum, cat) =>
            sum + cat.tasks.filter((t) => t.status === 'completed').length,
         0,
      );
      return Math.round((completedTasks / totalTasks) * 100);
   };

   const progress = calculateProgress();

   return (
      <section className="space-y-8 pb-12">
         {/* Phase Header – always visible */}
         <Card className="border-2 border-blue-500/20 bg-linear-to-br from-blue-500/5 to-transparent">
            <CardHeader>
               <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                     <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <Rocket className="h-8 w-8" />
                     </div>
                     <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                           <CardTitle className="text-3xl">
                              {t('roadmap.phase4Label', 'Phase 4')}
                           </CardTitle>
                           <Badge className="bg-blue-500">
                              {t('roadmap.phase4.status', 'Scale & Polish')}
                           </Badge>
                        </div>
                        <CardDescription className="text-xl font-semibold mb-2">
                           {t(
                              'roadmap.phase4.title',
                              'Scale & Polish – Performance, Offline, Jobs & Reporting',
                           )}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">
                           {t('roadmap.phase4.duration', 'Duration: 3-4 weeks')}
                        </p>
                     </div>
                  </div>
               </div>

               {/* Progress Bar */}
               <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                     <span className="font-medium">
                        {t('roadmap.progress', 'Overall Progress')}
                     </span>
                     <span className="font-bold text-blue-500">
                        {progress}%
                     </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                     <div
                        className="h-full bg-linear-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                     />
                  </div>
               </div>

               {/* Goal */}
               <div className="mt-6 rounded-lg border bg-card p-4">
                  <p className="mb-2 text-sm font-semibold">
                     {t('roadmap.goal', 'Goal')}:
                  </p>
                  <p className="text-muted-foreground">
                     {t(
                        'roadmap.phase4.goal',
                        'Make the application production-ready: fast, reliable, installable, offline-capable, and capable of handling scheduled & heavy workloads. Deliver professional-grade reports and bring polish to every interaction.',
                     )}
                  </p>
               </div>
            </CardHeader>
         </Card>

         {/* Collapsible detailed content */}
         <Accordion type="single" collapsible defaultValue={undefined}>
            <AccordionItem value="details" className="border-none">
               <AccordionTrigger className="rounded-lg border bg-muted/40 px-5 py-4 hover:no-underline hover:bg-muted/60">
                  <div className="flex items-center gap-3 font-medium text-lg">
                     <FileText className="h-5 w-5 text-muted-foreground" />
                     {t('roadmap.showDetails', 'Show phase details & tasks')}
                  </div>
               </AccordionTrigger>

               <AccordionContent className="pt-6">
                  <div className="space-y-10">
                     {/* Categories */}
                     <div className="grid gap-6">
                        {categories.map((category, index) => (
                           <Card
                              key={index}
                              className="border-2 transition-shadow hover:shadow-lg"
                           >
                              <CardHeader>
                                 <div className="flex items-center gap-3">
                                    <div
                                       className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${category.bgColor} ${category.color}`}
                                    >
                                       {category.icon}
                                    </div>
                                    <div className="flex-1">
                                       <CardTitle className="text-xl">
                                          {category.title}
                                       </CardTitle>
                                       <CardDescription>
                                          {category.description}
                                       </CardDescription>
                                    </div>
                                 </div>
                              </CardHeader>

                              <CardContent>
                                 <div className="space-y-3">
                                    {category.tasks.map((task, taskIndex) => (
                                       <div
                                          key={taskIndex}
                                          className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                                       >
                                          <div className="flex-1 space-y-1">
                                             <div className="flex items-center justify-between gap-3">
                                                <h4 className="font-semibold">
                                                   {task.name}
                                                </h4>
                                                {getStatusBadge(task.status)}
                                             </div>
                                             <p className="text-sm text-muted-foreground">
                                                {task.description}
                                             </p>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </CardContent>
                           </Card>
                        ))}
                     </div>

                     {/* Deliverable */}
                     <Card className="border-2 border-primary/20 bg-primary/5">
                        <CardContent className="pt-6">
                           <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                 <Target className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                 <h3 className="mb-2 font-semibold">
                                    {t(
                                       'roadmap.deliverable',
                                       'Phase Deliverable',
                                    )}
                                 </h3>
                                 <p className="text-muted-foreground">
                                    {t(
                                       'roadmap.phase4.deliverable',
                                       '🎯 App is installable on mobile/desktop, works offline for core views, loads noticeably faster, handles background tasks reliably, and delivers professional-looking scheduled & on-demand reports.',
                                    )}
                                 </p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     {/* Key Technologies */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              {t(
                                 'roadmap.phase4.technologies',
                                 'Key Technologies / Focus',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {[
                                 'Vite PWA Plugin / Workbox',
                                 'TanStack Query + persistQueryClient',
                                 'Supabase Edge Functions / pg_cron',
                                 'Web Vitals / Sentry / Vercel Analytics',
                                 'jsPDF / pdfmake (PDF generation)',
                                 'Vite Bundle Visualizer',
                                 'date-fns / lodash-es (optimizations)',
                                 'Service Worker + IndexedDB',
                              ].map((tech, index) => (
                                 <div
                                    key={index}
                                    className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3"
                                 >
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                                    <span className="text-sm font-medium">
                                       {tech}
                                    </span>
                                 </div>
                              ))}
                           </div>
                        </CardContent>
                     </Card>

                     {/* Success Criteria */}
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                              {t(
                                 'roadmap.phase4.successCriteria',
                                 'Success Criteria',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                              {[
                                 t(
                                    'roadmap.phase4.criteria1',
                                    'App can be installed on mobile/desktop with custom icon',
                                 ),
                                 t(
                                    'roadmap.phase4.criteria2',
                                    'Core views (dashboard, employee list) work offline',
                                 ),
                                 t(
                                    'roadmap.phase4.criteria3',
                                    'Push notifications for mentions/approvals/reminders are delivered',
                                 ),
                                 t(
                                    'roadmap.phase4.criteria4',
                                    'LCP < 2.5s, CLS < 0.1 on main pages (measured)',
                                 ),
                                 t(
                                    'roadmap.phase4.criteria5',
                                    'Long-running tasks (imports, reports) run in background without blocking UI',
                                 ),
                                 t(
                                    'roadmap.phase4.criteria6',
                                    'Reports can be exported as styled PDF and scheduled via email',
                                 ),
                                 t(
                                    'roadmap.phase4.criteria7',
                                    'Bundle size reduced meaningfully from previous phase',
                                 ),
                                 t(
                                    'roadmap.phase4.criteria8',
                                    'Application feels snappy and professional even on slower connections',
                                 ),
                              ].map((criterion, index) => (
                                 <li
                                    key={index}
                                    className="flex items-start gap-3"
                                 >
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                                    <span className="text-sm">{criterion}</span>
                                 </li>
                              ))}
                           </ul>
                        </CardContent>
                     </Card>
                  </div>
               </AccordionContent>
            </AccordionItem>
         </Accordion>
      </section>
   );
}
