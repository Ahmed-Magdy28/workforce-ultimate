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
   CheckCircle2,
   Globe,
   Shield,
   Lock,
   FileText,
   Sparkles,
   Users,
   Building2,
   ArrowRight,
   Target,
   Rocket,
} from 'lucide-react';
import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
} from '@/components/ui/accordion';

export default function RoadMapPhase1() {
   const { t } = useTranslation('roadmap');

   const categories = [
      {
         title: t('roadmap.phase1.publicWebsite.title', 'Public Website'),
         description: t(
            'roadmap.phase1.publicWebsite.description',
            'Professional public-facing pages to establish brand presence',
         ),
         icon: <Globe className="h-5 w-5" />,
         color: 'text-blue-500',
         bgColor: 'bg-blue-500/10',
         tasks: [
            {
               name: t('roadmap.phase1.publicWebsite.landing', 'Landing Page'),
               description: t(
                  'roadmap.phase1.publicWebsite.landingDesc',
                  'Hero section, features showcase, pricing, tech stack, and footer',
               ),
               status: 'completed' as const,
            },
            {
               name: t('roadmap.phase1.publicWebsite.about', 'About Us Page'),
               description: t(
                  'roadmap.phase1.publicWebsite.aboutDesc',
                  'Company story, mission, vision, and team information',
               ),
               status: 'completed' as const,
            },
            {
               name: t(
                  'roadmap.phase1.publicWebsite.docs',
                  'Documentation Hub',
               ),
               description: t(
                  'roadmap.phase1.publicWebsite.docsDesc',
                  'User guides, API reference, and tutorials',
               ),
               status: 'completed' as const,
            },
            {
               name: t('roadmap.phase1.publicWebsite.api', 'API Reference'),
               description: t(
                  'roadmap.phase1.publicWebsite.apiDesc',
                  'Placeholder for future API documentation',
               ),
               status: 'completed' as const,
            },
            {
               name: t('roadmap.phase1.publicWebsite.careers', 'Careers Page'),
               description: t(
                  'roadmap.phase1.publicWebsite.careersDesc',
                  'Job openings and application process',
               ),
               status: 'completed' as const,
            },
            {
               name: t('roadmap.phase1.publicWebsite.blog', 'Blog Section'),
               description: t(
                  'roadmap.phase1.publicWebsite.blogDesc',
                  'Articles, updates, and company news',
               ),
               status: 'completed' as const,
            },
            {
               name: t('roadmap.phase1.publicWebsite.legal', 'Legal Pages'),
               description: t(
                  'roadmap.phase1.publicWebsite.legalDesc',
                  'Privacy Policy, Terms of Service, Cookies Policy, Security',
               ),
               status: 'completed' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase1.ux.title', 'SEO + Dark Mode + i18n'),
         description: t(
            'roadmap.phase1.ux.description',
            'User experience enhancements for accessibility and reach',
         ),
         icon: <Sparkles className="h-5 w-5" />,
         color: 'text-purple-500',
         bgColor: 'bg-purple-500/10',
         tasks: [
            {
               name: t('roadmap.phase1.ux.seo', 'SEO Optimization'),
               description: t(
                  'roadmap.phase1.ux.seoDesc',
                  'Meta tags, Open Graph, structured data, canonical URLs',
               ),
               status: 'completed' as const,
            },
            {
               name: t('roadmap.phase1.ux.darkMode', 'Dark/Light Mode'),
               description: t(
                  'roadmap.phase1.ux.darkModeDesc',
                  'Theme toggle with system preference detection',
               ),
               status: 'completed' as const,
            },
            {
               name: t('roadmap.phase1.ux.i18n', 'Internationalization'),
               description: t(
                  'roadmap.phase1.ux.i18nDesc',
                  'English and Arabic language support with RTL',
               ),
               status: 'completed' as const,
            },
            {
               name: t('roadmap.phase1.ux.responsive', 'Responsive Design'),
               description: t(
                  'roadmap.phase1.ux.responsiveDesc',
                  'Mobile-first design that works on all devices',
               ),
               status: 'completed' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase1.auth.title', 'Authentication System'),
         description: t(
            'roadmap.phase1.auth.description',
            'Secure user authentication and authorization',
         ),
         icon: <Shield className="h-5 w-5" />,
         color: 'text-green-500',
         bgColor: 'bg-green-500/10',
         tasks: [
            {
               name: t('roadmap.phase1.auth.signin', 'Sign In / Sign Up'),
               description: t(
                  'roadmap.phase1.auth.signinDesc',
                  'User registration and login with email/password',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase1.auth.forgot', 'Forgot Password'),
               description: t(
                  'roadmap.phase1.auth.forgotDesc',
                  'Password reset flow with email verification',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase1.auth.verify', 'Email Verification'),
               description: t(
                  'roadmap.phase1.auth.verifyDesc',
                  'Confirm email address before account activation',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase1.auth.password', 'Password Requirements'),
               description: t(
                  'roadmap.phase1.auth.passwordDesc',
                  'Strong password validation and strength indicator',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase1.routing.title', 'Protected Routing'),
         description: t(
            'roadmap.phase1.routing.description',
            'Route protection and access control',
         ),
         icon: <Lock className="h-5 w-5" />,
         color: 'text-orange-500',
         bgColor: 'bg-orange-500/10',
         tasks: [
            {
               name: t('roadmap.phase1.routing.public', 'Public Routes'),
               description: t(
                  'roadmap.phase1.routing.publicDesc',
                  'a route to all the public pages',
               ),
               status: 'completed' as const,
            },
            {
               name: t('roadmap.phase1.routing.protected', 'Protected Routes'),
               description: t(
                  'roadmap.phase1.routing.protectedDesc',
                  'Prevent unauthorized access to dashboard',
               ),
               status: 'completed' as const,
            },
            {
               name: t('roadmap.phase1.routing.redirect', 'Smart Redirects'),
               description: t(
                  'roadmap.phase1.routing.redirectDesc',
                  'Redirect users based on auth state and role',
               ),
               status: 'pending' as const,
            },
            {
               name: t(
                  'roadmap.phase1.routing.persistence',
                  'Session Persistence',
               ),
               description: t(
                  'roadmap.phase1.routing.persistenceDesc',
                  'Remember user session across page refreshes',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase1.company.title', 'Company Creation (Basic)'),
         description: t(
            'roadmap.phase1.company.description',
            'Initial company setup functionality',
         ),
         icon: <Building2 className="h-5 w-5" />,
         color: 'text-cyan-500',
         bgColor: 'bg-cyan-500/10',
         tasks: [
            {
               name: t(
                  'roadmap.phase1.company.creation',
                  'Company Creation Flow',
               ),
               description: t(
                  'roadmap.phase1.company.creationDesc',
                  'Basic form to create a new company',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase1.company.profile', 'Company Profile'),
               description: t(
                  'roadmap.phase1.company.profileDesc',
                  'Store company name, industry, and basic details',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase1.company.ownership', 'Owner Assignment'),
               description: t(
                  'roadmap.phase1.company.ownershipDesc',
                  'Assign creator as company owner',
               ),
               status: 'pending' as const,
            },
         ],
      },
      {
         title: t('roadmap.phase1.rbac.title', 'RBAC Setup'),
         description: t(
            'roadmap.phase1.rbac.description',
            'Role-based access control foundation',
         ),
         icon: <Users className="h-5 w-5" />,
         color: 'text-pink-500',
         bgColor: 'bg-pink-500/10',
         tasks: [
            {
               name: t('roadmap.phase1.rbac.roles', 'Define Roles'),
               description: t(
                  'roadmap.phase1.rbac.rolesDesc',
                  'Employee, Manager, Senior Manager, Regional Manager, HR',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase1.rbac.permissions', 'Permission System'),
               description: t(
                  'roadmap.phase1.rbac.permissionsDesc',
                  'Define what each role can access and do',
               ),
               status: 'pending' as const,
            },
            {
               name: t('roadmap.phase1.rbac.middleware', 'Auth Middleware'),
               description: t(
                  'roadmap.phase1.rbac.middlewareDesc',
                  'Check permissions on route access',
               ),
               status: 'pending' as const,
            },
         ],
      },
   ];

   const getStatusBadge = (status: 'completed' | 'in-progress' | 'pending') => {
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
                              {t('roadmap.phase1Label', 'Phase 1')}
                           </CardTitle>
                           <Badge className="bg-blue-500">
                              {t('roadmap.phase1.status', 'In Progress')}
                           </Badge>
                        </div>
                        <CardDescription className="text-xl font-semibold mb-2">
                           {t(
                              'roadmap.phase1.title',
                              'Foundation - Public Website + Auth Core',
                           )}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">
                           {t('roadmap.phase1.duration', 'Duration: 3-4 weeks')}
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
                        'roadmap.phase1.goal',
                        'Make it look like a real SaaS with professional public presence and secure authentication. Establish the foundation for user management and role-based access control.',
                     )}
                  </p>
               </div>
            </CardHeader>
         </Card>

         {/* Collapsible detailed content */}
         <Accordion type="single" collapsible>
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
                                       'roadmap.phase1.deliverable',
                                       '🎯 Real SaaS appearance with public/private separation. Professional marketing website ready to launch. Secure authentication system in place. Foundation for company and user management established.',
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
                                 'roadmap.phase1.technologies',
                                 'Key Technologies Used',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {[
                                 'React + TypeScript',
                                 'React Router',
                                 'Tailwind CSS',
                                 'shadcn/ui',
                                 'Supabase Auth',
                                 'React Hook Form',
                                 'Zod Validation',
                                 'i18next',
                                 'React Helmet Async',
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
                                 'roadmap.phase1.successCriteria',
                                 'Success Criteria',
                              )}
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ul className="space-y-3">
                              {[
                                 t(
                                    'roadmap.phase1.criteria1',
                                    'All public pages are live and SEO-optimized',
                                 ),
                                 t(
                                    'roadmap.phase1.criteria2',
                                    'Users can sign up, sign in, and reset passwords',
                                 ),
                                 // ... rest of criteria
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
