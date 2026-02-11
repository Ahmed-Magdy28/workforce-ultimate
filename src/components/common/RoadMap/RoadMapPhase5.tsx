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
   Server,
   ArrowRightLeft,
   Clock,
   ArrowRight,
   Target,
   FileText,
   AlertTriangle,
} from 'lucide-react';
import type { JSX } from 'react';

export default function RoadMapPhase5() {
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
         title: t('roadmap.phase5.decision.title', 'Decision & Planning'),
         description: t(
            'roadmap.phase5.decision.description',
            'Evaluate whether custom backend is truly necessary and define migration strategy',
         ),
         icon: <AlertTriangle className="h-5 w-5" />,
         color: 'text-amber-500',
         bgColor: 'bg-amber-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase5.decision.analysis',
                  'Supabase Limitations Audit',
               ),
               description: t(
                  'roadmap.phase5.decision.analysisDesc',
                  'Cost at projected scale, query performance, row-level-security complexity, edge function limits, vendor lock-in concerns',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.decision.target',
                  'Choose Target Backend Stack',
               ),
               description: t(
                  'roadmap.phase5.decision.targetDesc',
                  'NestJS/TypeScript, FastAPI/Python, Go Fiber/Gin, Spring Boot — based on team expertise & long-term needs',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.decision.architecture',
                  'Architecture & Data Flow Design',
               ),
               description: t(
                  'roadmap.phase5.decision.architectureDesc',
                  'API structure, authentication (JWT + refresh), authorization (RBAC), event bus / queues, database choice (PostgreSQL / other)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.decision.migration',
                  'Migration Strategy (Big Bang vs Strangler Fig vs Hybrid)',
               ),
               description: t(
                  'roadmap.phase5.decision.migrationDesc',
                  'Decide gradual rollout: feature-by-feature proxy, read-from-new/write-to-both, dual-write pattern',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase5.backend.title', 'Custom Backend Development'),
         description: t(
            'roadmap.phase5.backend.description',
            'Build production-ready backend with feature parity',
         ),
         icon: <Server className="h-5 w-5" />,
         color: 'text-indigo-500',
         bgColor: 'bg-indigo-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase5.backend.auth',
                  'Authentication & Authorization',
               ),
               description: t(
                  'roadmap.phase5.backend.authDesc',
                  'JWT + refresh tokens, Supabase → custom auth migration path, role/permission enforcement',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.backend.crud',
                  'API Endpoints (CRUD + Business Logic)',
               ),
               description: t(
                  'roadmap.phase5.backend.crudDesc',
                  'Employees, companies, goals, evaluations, work-logs, comments, notifications, files…',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.backend.realtime',
                  'Realtime Subscriptions Replacement',
               ),
               description: t(
                  'roadmap.phase5.backend.realtimeDesc',
                  'WebSockets (Socket.IO / ws), Redis Pub/Sub, or third-party (Pusher, Ably) to replace Supabase Realtime',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.backend.storage',
                  'File Storage Integration',
               ),
               description: t(
                  'roadmap.phase5.backend.storageDesc',
                  'S3 / Cloudflare R2 / MinIO + signed URLs, replace Supabase Storage',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase5.migration.title',
            'Data Migration & Consistency',
         ),
         description: t(
            'roadmap.phase5.migration.description',
            'Safely move data from Supabase → new database with zero / minimal downtime',
         ),
         icon: <ArrowRightLeft className="h-5 w-5" />,
         color: 'text-teal-500',
         bgColor: 'bg-teal-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase5.migration.schema',
                  'Database Schema & Migration Scripts',
               ),
               description: t(
                  'roadmap.phase5.migration.schemaDesc',
                  'Prisma / Drizzle / TypeORM / Knex migrations — full schema parity',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.migration.initial',
                  'Initial Bulk Data Copy',
               ),
               description: t(
                  'roadmap.phase5.migration.initialDesc',
                  'One-time migration of all existing data (pg_dump / custom ETL script)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.migration.sync',
                  'Change Data Capture / Ongoing Sync',
               ),
               description: t(
                  'roadmap.phase5.migration.syncDesc',
                  'Dual-write during transition or Supabase → new DB replication (Debezium, custom triggers)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.migration.validation',
                  'Data Integrity & Validation',
               ),
               description: t(
                  'roadmap.phase5.migration.validationDesc',
                  'Row count checks, hash comparisons, sample audits, rollback plan',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase5.rollout.title', 'Gradual Rollout & Cutover'),
         description: t(
            'roadmap.phase5.rollout.description',
            'Deploy new backend safely with feature flags and traffic shifting',
         ),
         icon: <Clock className="h-5 w-5" />,
         color: 'text-purple-500',
         bgColor: 'bg-purple-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase5.rollout.flags',
                  'Feature Flags / Route Proxy',
               ),
               description: t(
                  'roadmap.phase5.rollout.flagsDesc',
                  'LaunchDarkly / Unleash / custom → route specific companies/users to new backend',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.rollout.monitoring',
                  'Observability & Alerting',
               ),
               description: t(
                  'roadmap.phase5.rollout.monitoringDesc',
                  'Prometheus/Grafana, Sentry, Datadog, logs comparison between old & new',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.rollout.cutover',
                  'Final Cutover & Supabase Decommission',
               ),
               description: t(
                  'roadmap.phase5.rollout.cutoverDesc',
                  'Traffic shift 100% → new backend, disable Supabase writes, eventual full shutdown',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase5.rollout.fallback',
                  'Rollback & Emergency Plan',
               ),
               description: t(
                  'roadmap.phase5.rollout.fallbackDesc',
                  'DNS rollback, database snapshot restore, communication plan',
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
         <Card className="border-2 border-gray-500/20 bg-linear-to-br from-gray-500/5 to-transparent">
            <CardHeader>
               <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                     <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-500/10 text-gray-500">
                        <Server className="h-8 w-8" />
                     </div>
                     <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                           <CardTitle className="text-3xl">
                              {t('roadmap.phase5Label', 'Phase 5')}
                           </CardTitle>
                           <Badge className="bg-gray-500">
                              {t(
                                 'roadmap.phase5.status',
                                 'Optional – Backend Migration',
                              )}
                           </Badge>
                        </div>
                        <CardDescription className="text-xl font-semibold mb-2">
                           {t(
                              'roadmap.phase5.title',
                              'Custom Backend + Data Migration + Gradual Cutover',
                           )}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">
                           {t(
                              'roadmap.phase5.duration',
                              'Duration: 6-8 weeks (only if triggered)',
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
                     <span className="font-bold text-gray-500">
                        {progress}%
                     </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                     <div
                        className="h-full bg-linear-to-r from-gray-500 to-gray-600 transition-all duration-500"
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
                        'roadmap.phase5.goal',
                        'If Supabase becomes a limiting factor (cost, performance, customization, compliance), migrate to a fully owned custom backend. Achieve full feature parity, zero-downtime data migration, and safe gradual rollout without disrupting users.',
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
                                       'roadmap.phase5.deliverable',
                                       '🎯 (If triggered) Fully custom backend running in production. All data successfully migrated. Old Supabase instance read-only or decommissioned. Zero major incidents during cutover. Team has full ownership and control over the entire stack.',
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
                                 'roadmap.phase5.technologies',
                                 'Key Technologies / Stack Options',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {[
                                 'NestJS / FastAPI / Go Fiber / Spring Boot',
                                 'PostgreSQL (same or TimescaleDB / Citus)',
                                 'Prisma / Drizzle / TypeORM / Knex',
                                 'Redis (caching + pub/sub)',
                                 'Socket.IO / ws / Ably / Pusher (realtime)',
                                 'BullMQ / Resque / Celery (background jobs)',
                                 'S3 / R2 / MinIO (file storage)',
                                 'Prometheus + Grafana / Datadog (monitoring)',
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
                                 'roadmap.phase5.successCriteria',
                                 'Success Criteria',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                              {[
                                 t(
                                    'roadmap.phase5.criteria1',
                                    'Custom backend handles 100% of production traffic',
                                 ),
                                 t(
                                    'roadmap.phase5.criteria2',
                                    'Zero data loss during migration',
                                 ),
                                 t(
                                    'roadmap.phase5.criteria3',
                                    'No major downtime or user-visible regressions during cutover',
                                 ),
                                 t(
                                    'roadmap.phase5.criteria4',
                                    'Performance equal or better than Supabase (API latency, throughput)',
                                 ),
                                 t(
                                    'roadmap.phase5.criteria5',
                                    'Realtime features (chat, notifications) working reliably',
                                 ),
                                 t(
                                    'roadmap.phase5.criteria6',
                                    'Cost model understood and predictable at current + projected scale',
                                 ),
                                 t(
                                    'roadmap.phase5.criteria7',
                                    'Team has full confidence in operating, debugging and scaling the new stack',
                                 ),
                                 t(
                                    'roadmap.phase5.criteria8',
                                    'Supabase instance safely decommissioned or reduced to archive-only',
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
