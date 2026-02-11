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
   Users,
   LayoutDashboard,
   Building2,
   ArrowRight,
   Target,
   Rocket,
   Briefcase,
   Sparkles,
   FileText,
} from 'lucide-react';
import type { JSX } from 'react';

type TaskStatus = 'completed' | 'in-progress' | 'pending';

type TaskItem = {
   name: string;
   description: string;
   status: TaskStatus;
};

type CategoryItem = {
   title: string;
   description: string;
   icon: JSX.Element;
   color: string;
   bgColor: string;
   tasks: TaskItem[];
};

export default function RoadMapPhase2() {
   const { t } = useTranslation();

   const categories: CategoryItem[] = [
      {
         title: t(
            'roadmap.phase2.employee.title',
            'Employee Management (Core)',
         ),
         description: t(
            'roadmap.phase2.employee.description',
            'CRUD operations for employees inside each company/tenant',
         ),
         icon: <Users className="h-5 w-5" />,
         color: 'text-emerald-500',
         bgColor: 'bg-emerald-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase2.employee.list',
                  'Employee Directory / List',
               ),
               description: t(
                  'roadmap.phase2.employee.listDesc',
                  'Paginated, searchable, filterable list of company employees',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.employee.create', 'Create New Employee'),
               description: t(
                  'roadmap.phase2.employee.createDesc',
                  'Form with personal info, job details, contact, documents upload',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.employee.edit', 'Edit Employee Profile'),
               description: t(
                  'roadmap.phase2.employee.editDesc',
                  'Update employee data + history tracking (audit log stub)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase2.employee.deactivate',
                  'Deactivate / Archive',
               ),
               description: t(
                  'roadmap.phase2.employee.deactivateDesc',
                  'Soft delete + reason + re-activation option',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.employee.bulk', 'Bulk Import (CSV)'),
               description: t(
                  'roadmap.phase2.employee.bulkDesc',
                  'Upload multiple employees via CSV with validation',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase2.dashboard.title',
            'Main Dashboard & Analytics',
         ),
         description: t(
            'roadmap.phase2.dashboard.description',
            'Company-level overview and basic metrics',
         ),
         icon: <LayoutDashboard className="h-5 w-5" />,
         color: 'text-indigo-500',
         bgColor: 'bg-indigo-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase2.dashboard.overview',
                  'Company Overview Widget',
               ),
               description: t(
                  'roadmap.phase2.dashboard.overviewDesc',
                  'Headcount, departments, active employees, pending actions',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.dashboard.charts', 'Basic Charts'),
               description: t(
                  'roadmap.phase2.dashboard.chartsDesc',
                  'Gender distribution, tenure, department breakdown (Recharts)',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase2.dashboard.recent',
                  'Recent Activity Feed',
               ),
               description: t(
                  'roadmap.phase2.dashboard.recentDesc',
                  'Last hires, terminations, profile updates',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.dashboard.quick', 'Quick Actions'),
               description: t(
                  'roadmap.phase2.dashboard.quickDesc',
                  'Add employee, request leave, view reports shortcuts',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase2.org.title', 'Organization Structure'),
         description: t(
            'roadmap.phase2.org.description',
            'Departments, job titles, reporting lines',
         ),
         icon: <Building2 className="h-5 w-5" />,
         color: 'text-teal-500',
         bgColor: 'bg-teal-500/10',
         tasks: [
            {
               name: t('roadmap.phase2.org.depts', 'Departments CRUD'),
               description: t(
                  'roadmap.phase2.org.deptsDesc',
                  'Create / edit departments with manager assignment',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.org.titles', 'Job Titles / Positions'),
               description: t(
                  'roadmap.phase2.org.titlesDesc',
                  'Manage job titles with description and level',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.org.chart', 'Basic Org Chart'),
               description: t(
                  'roadmap.phase2.org.chartDesc',
                  'Tree view of reporting structure (simple recursive component)',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t(
            'roadmap.phase2.profile.title',
            'Employee Self-Service Portal (Basic)',
         ),
         description: t(
            'roadmap.phase2.profile.description',
            'Employees can view & update their own data',
         ),
         icon: <Briefcase className="h-5 w-5" />,
         color: 'text-amber-500',
         bgColor: 'bg-amber-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase2.profile.personal',
                  'Personal Information',
               ),
               description: t(
                  'roadmap.phase2.profile.personalDesc',
                  'View / edit phone, address, emergency contact, profile photo',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.profile.documents', 'My Documents'),
               description: t(
                  'roadmap.phase2.profile.documentsDesc',
                  'View uploaded personal docs (ID, certificates…)',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.profile.password', 'Change Password'),
               description: t(
                  'roadmap.phase2.profile.passwordDesc',
                  'Self-service password update',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase2.ui.title', 'UI Polish & Navigation'),
         description: t(
            'roadmap.phase2.ui.description',
            'Better sidebar, breadcrumbs, mobile improvements',
         ),
         icon: <Sparkles className="h-5 w-5" />,
         color: 'text-purple-500',
         bgColor: 'bg-purple-500/10',
         tasks: [
            {
               name: t('roadmap.phase2.ui.sidebar', 'Role-aware Sidebar'),
               description: t(
                  'roadmap.phase2.ui.sidebarDesc',
                  'Dynamic menu based on role & company context',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.ui.breadcrumbs', 'Breadcrumbs'),
               description: t(
                  'roadmap.phase2.ui.breadcrumbsDesc',
                  'Navigation path shown on every page',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase2.ui.toasts', 'Consistent Notifications'),
               description: t(
                  'roadmap.phase2.ui.toastsDesc',
                  'Success/error toasts using sonner or similar',
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
         <Card className="border-2 border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
            <CardHeader>
               <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                     <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Rocket className="h-8 w-8" />
                     </div>
                     <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                           <CardTitle className="text-3xl">
                              {t('roadmap.phase2Label', 'Phase 2')}
                           </CardTitle>
                           <Badge className="bg-indigo-500">
                              {t(
                                 'roadmap.phase2.status',
                                 'Planned / In Progress',
                              )}
                           </Badge>
                        </div>
                        <CardDescription className="text-xl font-semibold mb-2">
                           {t(
                              'roadmap.phase2.title',
                              'Core HR - Employees + Dashboard + Organization',
                           )}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">
                           {t('roadmap.phase2.duration', 'Duration: 4-6 weeks')}
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
                     <span className="font-bold text-indigo-500">
                        {progress}%
                     </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                     <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
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
                        'roadmap.phase2.goal',
                        'Enable companies to manage their employees, visualize basic structure and metrics, and give employees basic self-service capabilities. Create the heart of the HR dashboard.',
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
                                       'roadmap.phase2.deliverable',
                                       '🎯 Functional employee management system. Company admins can add/view/edit employees. Basic dashboard shows key HR metrics. Employees can access their own profile. Organizational hierarchy starts taking shape.',
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
                                 'roadmap.phase2.technologies',
                                 'Key Technologies Used / Extended',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {[
                                 'React + TypeScript',
                                 'React Router',
                                 'Tailwind CSS + shadcn/ui',
                                 'Supabase (Auth + Database)',
                                 'TanStack Table / Query',
                                 'Recharts or Chart.js',
                                 'React Hook Form + Zod',
                                 'i18next + RTL',
                                 'Sonner (toasts)',
                                 'Lucide-react icons',
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
                                 'roadmap.phase2.successCriteria',
                                 'Success Criteria',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                              {[
                                 t(
                                    'roadmap.phase2.criteria1',
                                    'Company admin can add, edit and view employees',
                                 ),
                                 t(
                                    'roadmap.phase2.criteria2',
                                    'Employee list supports search, filter and pagination',
                                 ),
                                 t(
                                    'roadmap.phase2.criteria3',
                                    'Basic dashboard displays headcount and simple charts',
                                 ),
                                 t(
                                    'roadmap.phase2.criteria4',
                                    'Employee can log in and see/update their personal info',
                                 ),
                                 t(
                                    'roadmap.phase2.criteria5',
                                    'Departments and job titles can be managed',
                                 ),
                                 t(
                                    'roadmap.phase2.criteria6',
                                    'All pages respect RBAC (only authorized users see data)',
                                 ),
                                 t(
                                    'roadmap.phase2.criteria7',
                                    'UI is consistent, responsive and translated (EN/AR)',
                                 ),
                                 t(
                                    'roadmap.phase2.criteria8',
                                    'No critical security issues in employee CRUD flows',
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
