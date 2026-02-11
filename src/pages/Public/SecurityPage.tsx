import { useTranslation } from 'react-i18next';
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   Shield,
   Lock,
   CheckCircle2,
   AlertCircle,
   Mail,
   ArrowRight,
   Twitter,
} from 'lucide-react';

export default function SecurityPage() {
   const { t } = useTranslation();

   return (
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
         {/* Hero */}
         <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
               <Shield className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
               {t('security.title', 'Security & Data Protection')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
               {t(
                  'security.subtitle',
                  'Security matters — even though this is still a very small one-person project built in Cairo. Here’s what I currently do to keep your data reasonably safe, and what I plan to improve as we grow.',
               )}
            </p>
         </div>

         <div className="space-y-12 md:space-y-16">
            {/* Current Security Measures */}
            <Card className="border-2 border-primary/30 bg-linear-to-br from-primary/5 to-transparent">
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <Lock className="h-6 w-6" />
                     {t(
                        'security.measures.title',
                        'Current Security Practices (February 2026)',
                     )}
                  </CardTitle>
               </CardHeader>
               <CardContent className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold">
                              {t('security.measures.auth', 'Authentication')}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.measures.authDesc',
                                 'Supabase Auth with secure password hashing, rate limiting on login attempts, refresh token rotation, and session invalidation on password change.',
                              )}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold">
                              {t(
                                 'security.measures.rls',
                                 'Row Level Security (RLS)',
                              )}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.measures.rlsDesc',
                                 'Every table enforces RLS policies. Users can only read/write data that belongs to their company/tenant — enforced at the database level.',
                              )}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold">
                              {t(
                                 'security.measures.tls',
                                 'Encryption in Transit',
                              )}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.measures.tlsDesc',
                                 'All traffic uses TLS 1.3 (modern browsers enforce this). Supabase edge + CDN also enforce HTTPS.',
                              )}
                           </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold">
                              {t(
                                 'security.measures.storage',
                                 'File Storage Security',
                              )}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.measures.storageDesc',
                                 'Supabase Storage with private buckets by default, signed temporary URLs for downloads, file size & type restrictions, no public URLs.',
                              )}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold">
                              {t(
                                 'security.measures.logging',
                                 'Access & Activity Logging',
                              )}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.measures.loggingDesc',
                                 'Basic audit trail for important actions (login, password change, role changes, file uploads). Logs are stored securely and retained for troubleshooting.',
                              )}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold text-amber-700">
                              {t(
                                 'security.measures.limits.title',
                                 'Current limitations',
                              )}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.measures.limits.desc',
                                 'No formal SOC 2 / ISO 27001 yet, no external penetration tests, no bug bounty program, single developer — human error remains the biggest risk at this stage.',
                              )}
                           </p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Security Roadmap */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <ArrowRight className="h-6 w-6" />
                     {t('security.roadmap.title', 'Security Roadmap')}
                  </CardTitle>
                  <CardDescription className="text-base">
                     {t(
                        'security.roadmap.subtitle',
                        'What I plan to improve as the product grows and brings in revenue.',
                     )}
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-6">
                     <li className="flex items-start gap-4">
                        <Badge
                           variant="outline"
                           className="mt-1 min-w-35 justify-center"
                        >
                           {t(
                              'security.roadmap.short',
                              'Short-term (next 1–3 months)',
                           )}
                        </Badge>
                        <div className="space-y-2">
                           <p className="font-medium">
                              {t(
                                 'security.roadmap.2fa',
                                 'Enable 2FA / passkeys',
                              )}
                           </p>
                           <p className="text-sm text-muted-foreground">
                              {t(
                                 'security.roadmap.2faDesc',
                                 'Already supported by Supabase — will make mandatory for admin/manager roles first.',
                              )}
                           </p>
                        </div>
                     </li>

                     <li className="flex items-start gap-4">
                        <Badge
                           variant="outline"
                           className="mt-1 min-w-35 justify-center"
                        >
                           {t(
                              'security.roadmap.medium',
                              'Medium-term (3–12 months)',
                           )}
                        </Badge>
                        <div className="space-y-4">
                           <div>
                              <p className="font-medium">
                                 {t(
                                    'security.roadmap.audit',
                                    'External security audit / pentest',
                                 )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                 {t(
                                    'security.roadmap.auditDesc',
                                    'Once we have paying customers and meaningful usage.',
                                 )}
                              </p>
                           </div>
                           <div>
                              <p className="font-medium">
                                 {t(
                                    'security.roadmap.monitoring',
                                    'Better monitoring & alerting',
                                 )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                 {t(
                                    'security.roadmap.monitoringDesc',
                                    'Failed logins, suspicious IP patterns, large file uploads, unusual query patterns.',
                                 )}
                              </p>
                           </div>
                        </div>
                     </li>

                     <li className="flex items-start gap-4">
                        <Badge
                           variant="outline"
                           className="mt-1 min-w-35 justify-center"
                        >
                           {t(
                              'security.roadmap.long',
                              'Long-term / when enterprise-ready',
                           )}
                        </Badge>
                        <div className="space-y-4">
                           <div>
                              <p className="font-medium">
                                 {t(
                                    'security.roadmap.bounty',
                                    'Public bug bounty program',
                                 )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                 {t(
                                    'security.roadmap.bountyDesc',
                                    'Reward ethical hackers for finding real issues.',
                                 )}
                              </p>
                           </div>
                           <div>
                              <p className="font-medium">
                                 {t(
                                    'security.roadmap.compliance',
                                    'SOC 2 Type 1 / Type 2',
                                 )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                 {t(
                                    'security.roadmap.complianceDesc',
                                    'Only when we have enterprise interest and budget to justify the cost.',
                                 )}
                              </p>
                           </div>
                        </div>
                     </li>
                  </ul>
               </CardContent>
            </Card>

            {/* Report Security Issues */}
            <Card className="border-2 border-red-500/30 bg-linear-to-br from-red-500/5 to-transparent">
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <AlertCircle className="h-6 w-6 text-red-600" />
                     {t(
                        'security.report.title',
                        'Found a potential security issue?',
                     )}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <p className="text-lg">
                     {t(
                        'security.report.desc',
                        'If you discover any vulnerability — even something small — please report it responsibly. I take every report seriously and will respond quickly.',
                     )}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <Button size="lg" asChild>
                        <a href="mailto:ahmed@example.com?subject=Security%20Vulnerability%20Report">
                           <Mail className="mr-2 h-5 w-5" />
                           {t('security.report.email', 'Email security report')}
                        </a>
                     </Button>

                     <Button variant="outline" size="lg" asChild>
                        <a
                           href="https://twitter.com/AhMeDMaGDY1428"
                           target="_blank"
                           rel="noopener noreferrer"
                        >
                           <Twitter className="mr-2 h-5 w-5" />
                           {t(
                              'security.report.twitter',
                              'DM me privately on X',
                           )}
                        </a>
                     </Button>
                  </div>

                  <p className="text-sm text-muted-foreground italic">
                     {t(
                        'security.report.note',
                        'Please do NOT post vulnerabilities publicly until I’ve had a reasonable time to fix them. Thank you for helping keep this safe.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* Footer note */}
            <div className="text-center text-muted-foreground text-sm mt-16">
               <p>
                  {t(
                     'security.footer',
                     'This page is intentionally straightforward because the product is still very early. Security practices will become more formal (and more documented) as we grow and take on paying customers.',
                  )}
               </p>
               <p className="mt-2">
                  {t(
                     'security.footer.ps',
                     'Thanks for caring about security — it matters to me too.',
                  )}
               </p>
            </div>
         </div>
      </div>
   );
}
