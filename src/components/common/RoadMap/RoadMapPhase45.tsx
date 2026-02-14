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
   AppWindow,
   Store,
   Download,
   ArrowRight,
   Target,
   FileText,
   AlertTriangle,
} from 'lucide-react';
import type { JSX } from 'react';

export default function RoadMapPhase45() {
   const { t } = useTranslation('roadmap');

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
         title: t('roadmap.phase45.decision.title', 'Decision & Preparation'),
         description: t(
            'roadmap.phase45.decision.description',
            'Evaluate PWA limitations and prepare for native transition',
         ),
         icon: <AlertTriangle className="h-5 w-5" />,
         color: 'text-amber-500',
         bgColor: 'bg-amber-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase45.decision.metrics',
                  'Define PWA Success Metrics',
               ),
               description: t(
                  'roadmap.phase45.decision.metricsDesc',
                  'Minimum adoption rate, crash-free sessions, offline usage, push opt-in % after Phase 4',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase45.decision.user',
                  'User Feedback Collection',
               ),
               description: t(
                  'roadmap.phase45.decision.userDesc',
                  'Survey / in-app prompt: “Would you prefer a native app?” + pain points',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase45.decision.code',
                  'Code Audit for React Native Readiness',
               ),
               description: t(
                  'roadmap.phase45.decision.codeDesc',
                  'Identify shared logic (zustand, tanstack query, zod, i18n, API hooks) vs web-only code',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase45.setup.title',
            'React Native Setup & Shared Code',
         ),
         description: t(
            'roadmap.phase45.setup.description',
            'Bootstrap native project and maximize code reuse',
         ),
         icon: <Smartphone className="h-5 w-5" />,
         color: 'text-cyan-500',
         bgColor: 'bg-cyan-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase45.setup.init',
                  'Initialize React Native Project',
               ),
               description: t(
                  'roadmap.phase45.setup.initDesc',
                  'Expo or bare workflow (Expo recommended for faster iteration)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase45.setup.share',
                  'Shared Business Logic Package',
               ),
               description: t(
                  'roadmap.phase45.setup.shareDesc',
                  'Monorepo or separate package: hooks, utils, API clients, schemas, i18n',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase45.setup.ui',
                  'UI Component Library Adaptation',
               ),
               description: t(
                  'roadmap.phase45.setup.uiDesc',
                  'Map shadcn/ui → tamagui / nativewind / react-native-reusables / custom primitives',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase45.setup.navigation',
                  'Navigation Structure',
               ),
               description: t(
                  'roadmap.phase45.setup.navigationDesc',
                  'React Navigation (stack + tabs + drawer) mirroring web routes + deep linking',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase45.core.title', 'Core Mobile Features'),
         description: t(
            'roadmap.phase45.core.description',
            'Bring essential functionality to native environment',
         ),
         icon: <AppWindow className="h-5 w-5" />,
         color: 'text-indigo-500',
         bgColor: 'bg-indigo-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase45.core.auth',
                  'Authentication & Session Sync',
               ),
               description: t(
                  'roadmap.phase45.core.authDesc',
                  'Supabase auth + secure storage (expo-secure-store), refresh tokens, biometric login',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase45.core.offline',
                  'Enhanced Offline Support',
               ),
               description: t(
                  'roadmap.phase45.core.offlineDesc',
                  'Better offline handling (cache more aggressively, queue mutations, conflict UI)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase45.core.notifications',
                  'Native Push Notifications',
               ),
               description: t(
                  'roadmap.phase45.core.notificationsDesc',
                  'expo-notifications + Supabase channels → richer formatting & deep links',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase45.core.perf',
                  'Mobile Performance Tuning',
               ),
               description: t(
                  'roadmap.phase45.core.perfDesc',
                  'List virtualization (FlashList), image caching, avoid re-renders, Hermes engine',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase45.store.title',
            'App Store Deployment & Compliance',
         ),
         description: t(
            'roadmap.phase45.store.description',
            'Prepare, test and publish to Apple App Store & Google Play',
         ),
         icon: <Store className="h-5 w-5" />,
         color: 'text-violet-500',
         bgColor: 'bg-violet-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase45.store.assets',
                  'App Store Assets & Branding',
               ),
               description: t(
                  'roadmap.phase45.store.assetsDesc',
                  'Splash screens, icons (all sizes), screenshots for multiple devices, privacy policy',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase45.store.build', 'Build & Signing'),
               description: t(
                  'roadmap.phase45.store.buildDesc',
                  'EAS Build (Expo) or manual certificates/profiles → TestFlight + internal testing',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase45.store.review',
                  'App Review Preparation',
               ),
               description: t(
                  'roadmap.phase45.store.reviewDesc',
                  'Login test account, demo flows, explain Supabase auth & realtime usage',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase45.store.launch',
                  'Staged Rollout & Monitoring',
               ),
               description: t(
                  'roadmap.phase45.store.launchDesc',
                  'Gradual release, Crashlytics / Sentry, App Store Connect / Play Console analytics',
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
         <Card className="border-2 border-cyan-500/20 bg-linear-to-br from-cyan-500/5 to-transparent">
            <CardHeader>
               <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                     <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                        <Download className="h-8 w-8" />
                     </div>
                     <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                           <CardTitle className="text-3xl">
                              {t('roadmap.phase45Label', 'Phase 4.5')}
                           </CardTitle>
                           <Badge className="bg-cyan-500">
                              {t(
                                 'roadmap.phase45.status',
                                 'Optional – Native Mobile',
                              )}
                           </Badge>
                        </div>
                        <CardDescription className="text-xl font-semibold mb-2">
                           {t(
                              'roadmap.phase45.title',
                              'Native Mobile App (React Native + Stores)',
                           )}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">
                           {t(
                              'roadmap.phase45.duration',
                              'Duration: 4-6 weeks (only if needed)',
                           )}
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
                     <span className="font-bold text-cyan-500">
                        {progress}%
                     </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                     <div
                        className="h-full bg-linear-to-r from-cyan-500 to-cyan-600 transition-all duration-500"
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
                        'roadmap.phase45.goal',
                        'If the PWA experience falls short for mobile users (engagement, reliability, discoverability), deliver a native iOS + Android app using maximum code sharing. Publish to both app stores to improve retention, push reliability, and brand presence.',
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
                                       'roadmap.phase45.deliverable',
                                       '🎯 (If triggered) Native iOS + Android apps live in App Store & Google Play. Maximum code sharing with web. Native push, better offline, smoother animations, and App Store visibility achieved.',
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
                                 'roadmap.phase45.technologies',
                                 'Key Technologies / Stack',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {[
                                 'React Native (Expo recommended)',
                                 'React Navigation',
                                 'NativeWind / Tamagui / Restyle (styling)',
                                 'Expo Notifications + SecureStore',
                                 'Supabase JS client (shared)',
                                 'TanStack Query (shared)',
                                 'EAS Build & Submit',
                                 'Sentry / Bugsnag (crash reporting)',
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
                                 'roadmap.phase45.successCriteria',
                                 'Success Criteria',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                              {[
                                 t(
                                    'roadmap.phase45.criteria1',
                                    'Apps published and approved in both stores',
                                 ),
                                 t(
                                    'roadmap.phase45.criteria2',
                                    '≥70–80% of business logic shared between web & mobile',
                                 ),
                                 t(
                                    'roadmap.phase45.criteria3',
                                    'Native push notifications working reliably',
                                 ),
                                 t(
                                    'roadmap.phase45.criteria4',
                                    'Offline support noticeably better than PWA',
                                 ),
                                 t(
                                    'roadmap.phase45.criteria5',
                                    'Smooth onboarding + biometric login option',
                                 ),
                                 t(
                                    'roadmap.phase45.criteria6',
                                    'Performance comparable or better than web on mid-range devices',
                                 ),
                                 t(
                                    'roadmap.phase45.criteria7',
                                    'Crash-free sessions > 99.5% in first month',
                                 ),
                                 t(
                                    'roadmap.phase45.criteria8',
                                    'Positive initial reviews / feedback from mobile users',
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
