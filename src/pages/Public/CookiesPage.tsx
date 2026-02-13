import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
   Cookie,
   Shield,
   Clock,
   Mail,
   ArrowRight,
   AlertCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function CookiesPage() {
   const { t } = useTranslation();

   return (
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
         {/* Header */}
         <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
               <Cookie className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
               {t('cookies.title', 'Cookies Policy')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
               {t('cookies.subtitle', 'Last updated: February 12, 2026')}
            </p>

            <p className="text-sm text-muted-foreground mt-4 max-w-3xl mx-auto">
               {t(
                  'cookies.intro',
                  'This page explains what cookies we use, why we use them, and how you can manage them. Because this is a small one-person project, we keep cookie usage minimal and transparent.',
               )}
            </p>
         </div>

         <div className="space-y-12 md:space-y-16">
            {/* What are cookies */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t('cookies.section1.title', '1. What are cookies?')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p>
                     {t(
                        'cookies.section1.p1',
                        'Cookies are small text files that websites store on your device (computer, phone, tablet) when you visit them. They help the site remember information about your visit — like language preference, login state, or analytics — so the experience can be better next time.',
                     )}
                  </p>
                  <p>
                     {t(
                        'cookies.section1.p2',
                        'We only use strictly necessary and minimal functional cookies — no heavy advertising trackers or third-party profiling.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* Cookies we use */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t('cookies.section2.title', '2. Cookies we use')}
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-8">
                     <div className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-xl font-semibold">
                              {t(
                                 'cookies.section2.essential',
                                 'Essential / Strictly Necessary Cookies',
                              )}
                           </h3>
                           <Badge variant="secondary">
                              {t('cookies.section2.alwaysOn', 'Always on')}
                           </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                           {t(
                              'cookies.section2.essentialDesc',
                              'These are required for the website to function properly. You cannot disable them.',
                           )}
                        </p>
                        <ul className="space-y-3 text-sm">
                           <li className="flex items-start gap-3">
                              <Shield className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <div>
                                 <strong>Authentication & Session</strong> —
                                 remembers you are logged in
                              </div>
                           </li>
                           <li className="flex items-start gap-3">
                              <Shield className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <div>
                                 <strong>CSRF Protection</strong> — prevents
                                 cross-site request forgery attacks
                              </div>
                           </li>
                           <li className="flex items-start gap-3">
                              <Shield className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <div>
                                 <strong>Theme Preference</strong> — remembers
                                 dark/light mode choice
                              </div>
                           </li>
                        </ul>
                     </div>

                     <div className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-xl font-semibold">
                              {t(
                                 'cookies.section2.functional',
                                 'Functional Cookies',
                              )}
                           </h3>
                           <Badge variant="outline">
                              {t('cookies.section2.optional', 'Optional')}
                           </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                           {t(
                              'cookies.section2.functionalDesc',
                              'These improve your experience but are not strictly required for basic functionality.',
                           )}
                        </p>
                        <ul className="space-y-3 text-sm">
                           <li className="flex items-start gap-3">
                              <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                              <div>
                                 <strong>i18n / Language</strong> — remembers
                                 your language (English / Arabic) and RTL
                                 preference
                              </div>
                           </li>
                           <li className="flex items-start gap-3">
                              <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                              <div>
                                 <strong>UI Preferences</strong> — sidebar
                                 collapsed/expanded state, table sorting, etc.
                              </div>
                           </li>
                        </ul>
                     </div>

                     <div className="border rounded-lg p-6 bg-amber-500/5 border-amber-500/30">
                        <div className="flex items-center gap-3 mb-4">
                           <AlertCircle className="h-5 w-5 text-amber-600" />
                           <h3 className="text-xl font-semibold">
                              {t(
                                 'cookies.section2.analytics',
                                 'Analytics & Third-party Cookies',
                              )}
                           </h3>
                        </div>
                        <p className="text-muted-foreground">
                           {t(
                              'cookies.section2.analyticsDesc',
                              'Currently: none. We do not use Google Analytics, Meta Pixel, Hotjar, Mixpanel or any external tracking service. If we ever add analytics in the future, we will update this page and ask for consent first.',
                           )}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* How to manage cookies */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t(
                        'cookies.section3.title',
                        '3. How to manage or delete cookies',
                     )}
                  </CardTitle>
               </CardHeader>
               <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p>
                     {t(
                        'cookies.section3.p1',
                        'You can control cookies through your browser settings. Most browsers let you:',
                     )}
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                     <li>
                        {t(
                           'cookies.section3.li1',
                           'See what cookies are stored and delete them',
                        )}
                     </li>
                     <li>
                        {t(
                           'cookies.section3.li2',
                           'Block cookies from specific sites',
                        )}
                     </li>
                     <li>
                        {t('cookies.section3.li3', 'Block third-party cookies')}
                     </li>
                     <li>
                        {t(
                           'cookies.section3.li4',
                           'Turn off cookies completely (may break login/session)',
                        )}
                     </li>
                  </ul>
                  <p className="mt-4">
                     {t(
                        'cookies.section3.p2',
                        'Because we only use essential & minimal functional cookies, blocking them may make login, language selection, or theme persistence stop working properly.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* Contact & Questions */}
            <Card className="border-2 border-primary/30">
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <Mail className="h-6 w-6" />
                     {t('cookies.section4.title', 'Questions about cookies?')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <p>
                     {t(
                        'cookies.section4.p1',
                        'If anything is unclear, or you have concerns about how we use cookies, just reach out — I read every message personally.',
                     )}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button size="lg" asChild>
                        <a href="mailto:ahmed@example.com?subject=Question%20about%20Cookies%20Policy">
                           <Mail className="mr-2 h-5 w-5" />
                           {t('cookies.contact.email', 'Email me')}
                        </a>
                     </Button>

                     <Button variant="outline" size="lg" asChild>
                        <a href="/contact">
                           {t('cookies.contact.page', 'Go to Contact page')}
                           <ArrowRight className="ml-2 h-5 w-5" />
                        </a>
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Footer note */}
         <div className="text-center text-muted-foreground text-sm mt-16">
            <p>
               {t(
                  'cookies.footer',
                  'We keep this policy short and honest because this is still a very small project. It may grow more detailed as we add features or third-party services in the future.',
               )}
            </p>
            <p className="mt-2">
               {t(
                  'cookies.footer.ps',
                  'Thanks for reading — and for trusting us with your data.',
               )}
            </p>
         </div>
      </div>
   );
}
