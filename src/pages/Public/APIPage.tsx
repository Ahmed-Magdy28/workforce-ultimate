import { useTranslation } from 'react-i18next';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   Code2,
   Terminal,
   BookOpen,
   Zap,
   Shield,
   ArrowRight,
   Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function APIPage() {
   const { t } = useTranslation('api');

   const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success(t('api.copied', 'Copied to clipboard!'));
   };

   return (
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
         {/* Header */}
         <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
               <Code2 className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
               {t('api.title', 'Public API')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
               {t(
                  'api.subtitle',
                  'Build custom integrations, automate workflows, or pull your data into other tools. Simple, RESTful, and built by one person who actually uses it.',
               )}
            </p>
         </div>

         <div className="space-y-12 md:space-y-16">
            {/* Status & Authentication */}
            <Card className="border-2 border-primary/30 bg-linear-to-br from-primary/5 to-transparent">
               <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                     <Shield className="h-6 w-6 text-primary" />
                     {t('api.auth.title', 'Authentication')}
                  </CardTitle>
                  <CardDescription className="text-base">
                     {t(
                        'api.auth.desc',
                        'All API requests require authentication using a personal API key.',
                     )}
                  </CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all flex items-center justify-between gap-4">
                     <span className="text-muted-foreground">
                        {t(
                           'api.auth.example',
                           'Authorization: Bearer YOUR_API_KEY',
                        )}
                     </span>
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                           copyToClipboard('Authorization: Bearer YOUR_API_KEY')
                        }
                     >
                        <Copy className="h-4 w-4" />
                     </Button>
                  </div>

                  <div className="space-y-4">
                     <h4 className="font-semibold">
                        {t('api.auth.how', 'How to get your API key')}
                     </h4>
                     <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>{t('api.auth.step1', 'Log in to your account')}</li>
                        <li>
                           {t('api.auth.step2', 'Go to Settings → API Keys')}
                        </li>
                        <li>
                           {t('api.auth.step3', 'Click "Generate new key"')}
                        </li>
                        <li>
                           {t(
                              'api.auth.step4',
                              'Copy and store it securely — it won’t be shown again',
                           )}
                        </li>
                     </ol>
                     <Button variant="outline" className="mt-2">
                        {t(
                           'api.auth.gotodocs',
                           'Go to Settings (login required)',
                        )}
                     </Button>
                  </div>
               </CardContent>
            </Card>

            {/* Base URL & Rate Limits */}
            <div className="grid md:grid-cols-2 gap-8">
               <Card>
                  <CardHeader>
                     <CardTitle className="text-xl flex items-center gap-3">
                        <Terminal className="h-5 w-5" />
                        {t('api.base.title', 'Base URL')}
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="bg-muted p-4 rounded-lg font-mono text-sm flex items-center justify-between">
                        <code>https://api.yourdomain.com/v1</code>
                        <Button
                           variant="ghost"
                           size="icon"
                           onClick={() =>
                              copyToClipboard('https://api.yourdomain.com/v1')
                           }
                        >
                           <Copy className="h-4 w-4" />
                        </Button>
                     </div>
                     <p className="text-sm text-muted-foreground mt-4">
                        {t(
                           'api.base.note',
                           'All endpoints are versioned — use /v1 for now. v2 coming later in 2026.',
                        )}
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <CardTitle className="text-xl flex items-center gap-3">
                        <Zap className="h-5 w-5" />
                        {t('api.limits.title', 'Rate Limits')}
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span>{t('api.limits.free', 'Free plan')}</span>
                        <Badge variant="outline">60 requests / minute</Badge>
                     </div>
                     <div className="flex justify-between items-center">
                        <span>{t('api.limits.paid', 'Paid plans')}</span>
                        <Badge variant="secondary">300 requests / minute</Badge>
                     </div>
                     <p className="text-sm text-muted-foreground">
                        {t(
                           'api.limits.note',
                           'Rate limits are per API key. Burst allowed. Headers include remaining requests.',
                        )}
                     </p>
                  </CardContent>
               </Card>
            </div>

            {/* Quick Endpoints Overview */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <BookOpen className="h-6 w-6" />
                     {t('api.endpoints.title', 'Available Endpoints (v1)')}
                  </CardTitle>
                  <CardDescription>
                     {t(
                        'api.endpoints.desc',
                        'This is the current public surface — more endpoints will be added over time.',
                     )}
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-6">
                     {[
                        {
                           method: 'GET',
                           path: '/employees',
                           desc: t(
                              'api.endpoints.employees',
                              'List employees in your company (paginated)',
                           ),
                           auth: true,
                        },
                        {
                           method: 'GET',
                           path: '/employees/:id',
                           desc: t(
                              'api.endpoints.employee',
                              'Get single employee details',
                           ),
                           auth: true,
                        },
                        {
                           method: 'POST',
                           path: '/employees',
                           desc: t(
                              'api.endpoints.createEmployee',
                              'Create a new employee (admin/manager only)',
                           ),
                           auth: true,
                        },
                        {
                           method: 'GET',
                           path: '/work-logs',
                           desc: t(
                              'api.endpoints.worklogs',
                              'List work logs (filter by date, employee, etc.)',
                           ),
                           auth: true,
                        },
                        {
                           method: 'GET',
                           path: '/goals',
                           desc: t(
                              'api.endpoints.goals',
                              'List goals / OKRs (personal or team)',
                           ),
                           auth: true,
                        },
                     ].map((endpoint, i) => (
                        <div
                           key={i}
                           className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                           <div className="flex items-center gap-4">
                              <Badge
                                 variant={
                                    endpoint.method === 'GET'
                                       ? 'secondary'
                                       : 'default'
                                 }
                                 className={
                                    endpoint.method === 'GET'
                                       ? 'bg-green-500/10 text-green-700 hover:bg-green-500/20'
                                       : 'bg-blue-500/10 text-blue-700 hover:bg-blue-500/20'
                                 }
                              >
                                 {endpoint.method}
                              </Badge>
                              <code className="font-mono text-sm">
                                 {endpoint.path}
                              </code>
                           </div>
                           <p className="text-sm text-muted-foreground flex-1">
                              {endpoint.desc}
                           </p>
                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Shield className="h-3.5 w-3.5" />
                              {t('api.auth.required', 'Auth required')}
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="mt-8 text-center">
                     <Button asChild>
                        <a
                           href="https://docs.yourdomain.com/api"
                           target="_blank"
                           rel="noopener noreferrer"
                        >
                           {t('api.fullDocs', 'View full API documentation →')}
                           <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                     </Button>
                     <p className="text-sm text-muted-foreground mt-3">
                        {t(
                           'api.docsNote',
                           'Interactive docs, examples, OpenAPI spec, and more',
                        )}
                     </p>
                  </div>
               </CardContent>
            </Card>

            {/* Footer note */}
            <div className="text-center text-muted-foreground text-sm mt-12">
               <p>
                  {t(
                     'api.footer',
                     'Built and maintained by one person in Cairo. If something is missing or unclear — just email me.',
                  )}
               </p>
               <Button variant="link" asChild className="mt-2">
                  <a href="/contact">
                     {t('api.contact', 'Contact me about the API')}
                  </a>
               </Button>
            </div>
         </div>
      </div>
   );
}
