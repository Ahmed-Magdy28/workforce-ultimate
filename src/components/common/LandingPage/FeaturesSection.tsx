import { useTranslation } from 'react-i18next';
import {
   Users,
   FolderKanban,
   CheckSquare,
   Clock,
   Bell,
   BarChart3,
   MessageSquare,
   FileText,
   Upload,
   Award,
   Shield,
   TrendingUp,
} from 'lucide-react';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function FeaturesSection() {
   const { t } = useTranslation();

   const features = [
      {
         icon: <Shield className="h-6 w-6" />,
         title: t('features Section.roles.title', 'User Roles & Hierarchy'),
         description: t(
            'features Section.roles.description',
            'Multi-level permission system with Employee, Manager, Senior Manager, Regional Manager, and HR roles. Complete hierarchical structure for effective management.',
         ),
         color: 'text-blue-500',
         bgColor: 'bg-blue-500/10',
      },
      {
         icon: <FolderKanban className="h-6 w-6" />,
         title: t('features Section.projects.title', 'Project Management'),
         description: t(
            'features Section.projects.description',
            'Create projects, assign team members, and track progress through dedicated dashboards. Manage project states from Active to Completed with full visibility.',
         ),
         color: 'text-purple-500',
         bgColor: 'bg-purple-500/10',
      },
      {
         icon: <CheckSquare className="h-6 w-6" />,
         title: t('features Section.tasks.title', 'Task Management System'),
         description: t(
            'features Section.tasks.description',
            'Create and assign tasks with priority levels (Normal, Important, Very Important, Critical). Employees can accept, suggest modifications, or report conflicts.',
         ),
         color: 'text-green-500',
         bgColor: 'bg-green-500/10',
      },
      {
         icon: <Clock className="h-6 w-6" />,
         title: t('features Section.scheduling.title', 'Smart Scheduling'),
         description: t(
            'features Section.scheduling.description',
            'Employees set schedules and estimate task duration. Managers review, approve, or modify time allocations for optimal resource planning.',
         ),
         color: 'text-orange-500',
         bgColor: 'bg-orange-500/10',
      },
      {
         icon: <Bell className="h-6 w-6" />,
         title: t(
            'features Section.notifications.title',
            'Real-time Notifications',
         ),
         description: t(
            'features Section.notifications.description',
            'Instant alerts for task assignments, time changes, approvals, priority updates, and delays. Stay informed on every update that matters.',
         ),
         color: 'text-red-500',
         bgColor: 'bg-red-500/10',
      },
      {
         icon: <BarChart3 className="h-6 w-6" />,
         title: t(
            'features Section.performance.title',
            'Performance Evaluation',
         ),
         description: t(
            'features Section.performance.description',
            'Track performance with task-based scoring. View weekly, monthly, and annual evaluations. Identify top performers automatically.',
         ),
         color: 'text-indigo-500',
         bgColor: 'bg-indigo-500/10',
      },
      {
         icon: <MessageSquare className="h-6 w-6" />,
         title: t('features Section.communication.title', 'Team Communication'),
         description: t(
            'features Section.communication.description',
            'Built-in group chat for each team. Keep all work-related communication organized and accessible within the platform.',
         ),
         color: 'text-cyan-500',
         bgColor: 'bg-cyan-500/10',
      },
      {
         icon: <FileText className="h-6 w-6" />,
         title: t('features Section.logs.title', 'Daily Work Logs'),
         description: t(
            'features Section.logs.description',
            'Document daily task updates and end-of-day notes. Improve tracking and maintain detailed work history for better accountability.',
         ),
         color: 'text-yellow-500',
         bgColor: 'bg-yellow-500/10',
      },
      {
         icon: <Upload className="h-6 w-6" />,
         title: t(
            'features Section.files.title',
            'File Management & Integrations',
         ),
         description: t(
            'features Section.files.description',
            'Upload files within tasks with permission controls. Integrate seamlessly with GitHub and Gmail for enhanced workflow.',
         ),
         color: 'text-pink-500',
         bgColor: 'bg-pink-500/10',
      },
      {
         icon: <Award className="h-6 w-6" />,
         title: t('features Section.hr.title', 'HR Management'),
         description: t(
            'features Section.hr.description',
            'Managers can add bonuses and warnings. HR tracks all employee records, reviews bonuses, and manages disciplinary actions.',
         ),
         color: 'text-teal-500',
         bgColor: 'bg-teal-500/10',
      },
      {
         icon: <Users className="h-6 w-6" />,
         title: t('features Section.profiles.title', 'Employee Profiles'),
         description: t(
            'features Section.profiles.description',
            'Employees update personal information. HR reviews, requests modifications, or directly updates employee data as needed.',
         ),
         color: 'text-violet-500',
         bgColor: 'bg-violet-500/10',
      },
      {
         icon: <TrendingUp className="h-6 w-6" />,
         title: t('features Section.dashboards.title', 'Custom Dashboards'),
         description: t(
            'features Section.dashboards.description',
            'Role-based dashboards for Employees and Managers. View daily tasks, change logs, satisfaction rates, and project progress at a glance.',
         ),
         color: 'text-emerald-500',
         bgColor: 'bg-emerald-500/10',
      },
   ];

   return (
      <section id="features" className="py-20 sm:py-24 lg:py-32 bg-muted/30">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mx-auto max-w-2xl text-center mb-16">
               <Badge variant="outline" className="mb-4">
                  {t('features Section.badge', 'Features')}
               </Badge>
               <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
                  {t('features Section.heading', 'Everything You Need to')}{' '}
                  <br />
                  <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                     {t(
                        'features Section.headingHighlight',
                        'Manage Your Workforce',
                     )}
                  </span>
               </h2>
               <p className="text-lg text-muted-foreground">
                  {t(
                     'features Section.subheading',
                     'Comprehensive tools designed to streamline operations, boost productivity, and empower your team.',
                  )}
               </p>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
               {features.map((feature, index) => (
                  <Card
                     key={index}
                     className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:border-primary/50"
                  >
                     {/* Hover effect background */}
                     <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                     <CardHeader>
                        <div
                           className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor} ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                        >
                           {feature.icon}
                        </div>
                        <CardTitle className="text-xl">
                           {feature.title}
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <CardDescription className="text-base leading-relaxed">
                           {feature.description}
                        </CardDescription>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
               <p className="text-muted-foreground mb-4">
                  {t(
                     'features Section.cta.text',
                     'Ready to transform your team management?',
                  )}
               </p>
               <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                     href="#pricing"
                     className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                     {t('features Section.cta.primary', 'View Pricing')}
                  </a>
                  <a
                     href="/signup"
                     className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                     {t('features Section.cta.secondary', 'Start Free Trial')}
                  </a>
               </div>
            </div>
         </div>
      </section>
   );
}
