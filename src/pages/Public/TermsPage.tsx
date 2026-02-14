import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Mail, ArrowRight } from 'lucide-react';

export default function TermsPage() {
   const { t } = useTranslation('terms');

   return (
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
         {/* Header */}
         <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
               <FileText className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
               {t('terms.title', 'Terms of Service')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
               {t('terms.subtitle', 'Last updated: February 12, 2026')}
            </p>

            <p className="text-sm text-muted-foreground mt-4">
               {t(
                  'terms.intro',
                  'These are the terms under which you may use this service. Because this is a very early-stage product built by one person, they are intentionally short and written in plain language.',
               )}
            </p>
         </div>

         <div className="space-y-12 md:space-y-16">
            {/* 1. Acceptance */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t('terms.section1.title', '1. Acceptance of Terms')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p>
                     {t(
                        'terms.section1.p1',
                        'By accessing or using this website or service (the “Service”), you agree to be bound by these Terms of Service (“Terms”). If you do not agree with any part of these Terms, you may not use the Service.',
                     )}
                  </p>
                  <p>
                     {t(
                        'terms.section1.p2',
                        'We may update these Terms from time to time. We will notify you of material changes (via email or in-app notice). Your continued use after changes constitutes acceptance of the new terms.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* 2. Description of Service */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t(
                        'terms.section2.title',
                        '2. Description of the Service',
                     )}
                  </CardTitle>
               </CardHeader>
               <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p>
                     {t(
                        'terms.section2.p1',
                        'This is an early-stage HR/workforce management tool built and maintained by one individual. It includes features such as employee profiles, work logs, goals, basic evaluations, notifications, and more — all still in active development.',
                     )}
                  </p>
                  <p>
                     {t(
                        'terms.section2.p2',
                        'The Service is provided “as is” and “as available”. Features may change, be removed, or break occasionally — especially during this early phase.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* 3. Accounts & Security */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t('terms.section3.title', '3. Accounts & Security')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p>
                     {t(
                        'terms.section3.p1',
                        'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
                     )}
                  </p>
                  <p>
                     {t(
                        'terms.section3.p2',
                        'You must notify us immediately of any unauthorized use or security breach. We are not liable for any loss or damage arising from your failure to secure your account.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* 4. Acceptable Use */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t('terms.section4.title', '4. Acceptable Use')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p>{t('terms.section4.p1', 'You agree not to:')}</p>
                  <ul className="list-disc pl-6 space-y-2">
                     <li>
                        {t(
                           'terms.section4.li1',
                           'Use the Service for any unlawful purpose',
                        )}
                     </li>
                     <li>
                        {t(
                           'terms.section4.li2',
                           'Attempt to gain unauthorized access to any part of the Service',
                        )}
                     </li>
                     <li>
                        {t(
                           'terms.section4.li3',
                           'Interfere with or disrupt the Service or servers/networks',
                        )}
                     </li>
                     <li>
                        {t(
                           'terms.section4.li4',
                           'Upload viruses, malware, or harmful code',
                        )}
                     </li>
                     <li>
                        {t(
                           'terms.section4.li5',
                           'Harass, abuse, or harm other users',
                        )}
                     </li>
                     <li>
                        {t(
                           'terms.section4.li6',
                           'Scrape, crawl, or systematically collect data without permission',
                        )}
                     </li>
                  </ul>
               </CardContent>
            </Card>

            {/* 5. Data & Privacy */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t('terms.section5.title', '5. Your Data & Privacy')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p>
                     {t(
                        'terms.section5.p1',
                        'You retain ownership of any data you upload or input into the Service (“Your Data”). By using the Service, you grant us a limited license to store, process, and display Your Data solely to provide and improve the Service.',
                     )}
                  </p>
                  <p>
                     {t(
                        'terms.section5.p2',
                        'We take reasonable measures to protect Your Data, but we cannot guarantee absolute security. Please do not upload sensitive personal information (health records, financial data, etc.) unless necessary.',
                     )}
                  </p>
                  <p className="font-medium">
                     {t(
                        'terms.section5.p3',
                        'See our separate Privacy Policy for more details on how we handle data.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* 6. Limitation of Liability */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t('terms.section6.title', '6. Limitation of Liability')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p>
                     {t(
                        'terms.section6.p1',
                        'The Service is provided “as is” without warranties of any kind. We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service — even if advised of the possibility.',
                     )}
                  </p>
                  <p className="font-medium text-amber-700">
                     {t(
                        'terms.section6.p2',
                        'Because this is an early-stage product built by one person, downtime, bugs, data loss, or missing features may happen. Use at your own risk.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* 7. Termination */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t('terms.section7.title', '7. Termination')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
                  <p>
                     {t(
                        'terms.section7.p1',
                        'We may suspend or terminate your access to the Service at any time, with or without cause or notice, especially if we believe you have violated these Terms.',
                     )}
                  </p>
                  <p>
                     {t(
                        'terms.section7.p2',
                        'You may stop using the Service at any time. Upon termination, your right to use the Service ends immediately.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* 8. Governing Law & Contact */}
            <Card className="border-2 border-primary/30">
               <CardHeader>
                  <CardTitle className="text-2xl">
                     {t('terms.section8.title', '8. Governing Law & Contact')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <p>
                     {t(
                        'terms.section8.p1',
                        'These Terms are governed by the laws of Egypt, without regard to conflict of law principles.',
                     )}
                  </p>
                  <p>
                     {t(
                        'terms.section8.p2',
                        'If you have any questions about these Terms, please contact me directly:',
                     )}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Button size="lg" asChild>
                        <a href="mailto:ahmed@example.com?subject=Question%20about%20Terms%20of%20Service">
                           <Mail className="mr-2 h-5 w-5" />
                           {t('terms.contact.email', 'Email me')}
                        </a>
                     </Button>

                     <Button variant="outline" size="lg" asChild>
                        <a href="/contact">
                           {t('terms.contact.page', 'Go to Contact page')}
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
                  'terms.footer',
                  'These terms are intentionally short and human-readable because this is a small, early-stage project. They may evolve as the product grows.',
               )}
            </p>
            <p className="mt-2">
               {t(
                  'terms.footer.ps',
                  'Thanks for reading — and for using the service.',
               )}
            </p>
         </div>
      </div>
   );
}
