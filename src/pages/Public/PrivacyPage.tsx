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
import { Twitter } from 'lucide-react';
import {
   Shield,
   Lock,
   CheckCircle2,
   AlertCircle,
   Mail,
   ArrowRight,
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
                  'Security is not an afterthought — even though this is still a very small one-person project. Here’s what I do today to keep your data reasonably safe.',
               )}
            </p>
         </div>

         <div className="space-y-12 md:space-y-16">
            {/* Current Security Posture */}
            <Card className="border-2 border-primary/30 bg-linear-to-br from-primary/5 to-transparent">
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <Lock className="h-6 w-6" />
                     {t(
                        'security.posture.title',
                        'Current Security Practices (2026)',
                     )}
                  </CardTitle>
               </CardHeader>
               <CardContent className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold">
                              {t('security.posture.auth', 'Authentication')}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.posture.authDesc',
                                 'Supabase Auth (email + password, secure tokens, refresh rotation, rate limiting). No social logins yet.',
                              )}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold">
                              {t(
                                 'security.posture.rls',
                                 'Row Level Security (RLS)',
                              )}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.posture.rlsDesc',
                                 'Every table uses RLS. Users can only see and modify data belonging to their company.',
                              )}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold">
                              {t('security.posture.encryption', 'Encryption')}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.posture.encryptionDesc',
                                 'Data in transit: TLS 1.3 everywhere. Data at rest: encrypted by Supabase (PostgreSQL). Sensitive fields (if any) are encrypted client-side where possible.',
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
                              {t('security.posture.storage', 'File Storage')}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.posture.storageDesc',
                                 'Supabase Storage with signed URLs, public buckets avoided, file type & size restrictions.',
                              )}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold">
                              {t(
                                 'security.posture.monitoring',
                                 'Monitoring & Alerts',
                              )}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.posture.monitoringDesc',
                                 'Login attempts, failed auth, suspicious activity logged. Basic alerting via email for critical events.',
                              )}
                           </p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4">
                        <AlertCircle className="h-6 w-6 text-amber-500 shrink-0 mt-1" />
                        <div>
                           <h4 className="font-semibold text-amber-700">
                              {t(
                                 'security.posture.limit.title',
                                 'Current limitations',
                              )}
                           </h4>
                           <p className="text-muted-foreground mt-1">
                              {t(
                                 'security.posture.limit.desc',
                                 'No formal SOC 2 yet, no bug bounty program, no external pentests (yet), single developer — so human error is the biggest risk right now.',
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
                     {t(
                        'security.roadmap.title',
                        'Security Roadmap (what comes next)',
                     )}
                  </CardTitle>
                  <CardDescription className="text-base">
                     {t(
                        'security.roadmap.subtitle',
                        'As the product grows and brings in revenue, I plan to invest more seriously in security.',
                     )}
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <ul className="space-y-5">
                     <li className="flex items-start gap-4">
                        <Badge
                           variant="outline"
                           className="mt-1 min-w-35 justify-center"
                        >
                           {t('security.roadmap.short', 'Short-term')}
                        </Badge>
                        <div>
                           <p className="font-medium">
                              {t(
                                 'security.roadmap.short1',
                                 'Enable 2FA / passkeys (already supported by Supabase)',
                              )}
                           </p>
                           <p className="text-sm text-muted-foreground mt-1">
                              {t(
                                 'security.roadmap.short1desc',
                                 'Will enforce for admin roles first, then optional for everyone.',
                              )}
                           </p>
                        </div>
                     </li>

                     <li className="flex items-start gap-4">
                        <Badge
                           variant="outline"
                           className="mt-1 min-w-35 justify-center"
                        >
                           {t('security.roadmap.medium', 'Medium-term')}
                        </Badge>
                        <div>
                           <p className="font-medium">
                              {t(
                                 'security.roadmap.medium1',
                                 'External security audit / penetration test',
                              )}
                           </p>
                           <p className="text-sm text-muted-foreground mt-1">
                              {t(
                                 'security.roadmap.medium1desc',
                                 'Once we have paying customers and meaningful data.',
                              )}
                           </p>
                        </div>
                     </li>

                     <li className="flex items-start gap-4">
                        <Badge
                           variant="outline"
                           className="mt-1 min-w-35 justify-center"
                        >
                           {t('security.roadmap.long', 'Long-term')}
                        </Badge>
                        <div className="space-y-4">
                           <div>
                              <p className="font-medium">
                                 {t(
                                    'security.roadmap.long1',
                                    'Bug bounty program',
                                 )}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                 {t(
                                    'security.roadmap.long1desc',
                                    'Invite ethical hackers to find issues with rewards.',
                                 )}
                              </p>
                           </div>
                           <div>
                              <p className="font-medium">
                                 {t(
                                    'security.roadmap.long2',
                                    'SOC 2 / ISO 27001',
                                 )}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                 {t(
                                    'security.roadmap.long2desc',
                                    'Only when we have enterprise interest and budget.',
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
                     {t('security.report.title', 'Found a security issue?')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <p className="text-lg">
                     {t(
                        'security.report.desc',
                        'If you discover any security vulnerability — even small — please report it responsibly. I take every report seriously.',
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
                        'Please do not post vulnerabilities publicly until I’ve had reasonable time to fix them. Thank you for helping keep this safe.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* Footer note */}
            <div className="text-center text-muted-foreground text-sm mt-12">
               <p>
                  {t(
                     'security.footer',
                     'This page is intentionally straightforward because the product is still very early. Security will become more formal as we grow and take on paying customers.',
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
