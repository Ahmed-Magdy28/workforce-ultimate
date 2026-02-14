import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Twitter } from 'lucide-react';
import {
   HelpCircle,
   Mail,
   MessageCircle,
   FileQuestion,
   CheckCircle2,
   AlertCircle,
   Send,
} from 'lucide-react';
import { myEmail } from '@/utils/constants';

export default function SupportPage() {
   const { t } = useTranslation('support');

   return (
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
         {/* Hero */}
         <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
               <HelpCircle className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
               {t('support.title', 'Help & Support')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
               {t(
                  'support.subtitle',
                  'This is still a very small one-person project, so support is personal and direct — I answer every message myself (usually within 24–48 hours).',
               )}
            </p>
         </div>

         <div className="grid md:grid-cols-3 gap-8 md:gap-10 mb-16 md:mb-20">
            {/* Quick options */}
            <Card className="border-2 hover:border-primary/50 transition-all">
               <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                     <Mail className="h-5 w-5 text-primary" />
                     {t('support.email.title', 'Email me')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                     {t(
                        'support.email.desc',
                        'Best for detailed questions, screenshots, bug reports, feature requests, or anything private.',
                     )}
                  </p>
                  <Button size="lg" className="w-full" asChild>
                     <a href={`mailto:${myEmail}?subject=Support%20request`}>
                        <Send className="mr-2 h-5 w-5" />
                        {t('support.email.action', 'Open email client')}
                     </a>
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                     {t('support.email.note', myEmail)}
                  </p>
               </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all">
               <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                     <MessageCircle className="h-5 w-5 text-primary" />
                     {t('support.chat.title', 'Quick chat')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                     {t(
                        'support.chat.desc',
                        'Fastest way for short questions, clarifications or “is this a bug?” moments.',
                     )}
                  </p>
                  <div className="flex flex-col gap-3">
                     <Button
                        variant="outline"
                        className="justify-start"
                        asChild
                     >
                        <a
                           href="https://twitter.com/AhMeDMaGDY1428"
                           target="_blank"
                           rel="noopener noreferrer"
                        >
                           <Twitter className="mr-2 h-5 w-5 text-sky-500" />
                           {t('support.chat.twitter', 'DM me on X')}
                        </a>
                     </Button>
                     <Button
                        variant="outline"
                        className="justify-start"
                        disabled
                     >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        {t('support.chat.telegram', 'Telegram (coming soon)')}
                        <Badge variant="secondary" className="ml-auto text-xs">
                           Soon
                        </Badge>
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all">
               <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                     <FileQuestion className="h-5 w-5 text-primary" />
                     {t('support.faq.title', 'Common Questions')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                     {t(
                        'support.faq.desc',
                        'Quick answers to things people usually ask before emailing me.',
                     )}
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                     <a href="/faq">
                        <BookOpen className="mr-2 h-5 w-5" />
                        {t('support.faq.action', 'Read the FAQ')}
                     </a>
                  </Button>
                  <p className="text-sm text-muted-foreground text-center italic">
                     {t(
                        'support.faq.note',
                        '(Page under construction — coming soon)',
                     )}
                  </p>
               </CardContent>
            </Card>
         </div>

         {/* What to include when contacting */}
         <Card className="mb-16 md:mb-20 border-2 border-amber-500/30 bg-linear-to-br from-amber-500/5 to-transparent">
            <CardHeader>
               <CardTitle className="text-2xl flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                  {t('support.tips.title', 'How to get fastest & best help')}
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <ul className="space-y-4">
                  <li className="flex gap-4">
                     <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                     <div>
                        <strong>
                           {t('support.tips.screenshot', 'Include screenshots')}
                        </strong>{' '}
                        —{' '}
                        {t(
                           'support.tips.screenshotDesc',
                           'especially for bugs or UI confusion',
                        )}
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                     <div>
                        <strong>
                           {t(
                              'support.tips.browser',
                              'Mention browser & device',
                           )}
                        </strong>{' '}
                        —{' '}
                        {t(
                           'support.tips.browserDesc',
                           'Chrome on Android, Safari on iPhone 14, etc.',
                        )}
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                     <div>
                        <strong>
                           {t(
                              'support.tips.steps',
                              'Describe steps to reproduce',
                           )}
                        </strong>{' '}
                        —{' '}
                        {t(
                           'support.tips.stepsDesc',
                           '“I clicked X → then Y → got error Z”',
                        )}
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                     <div>
                        <strong>
                           {t(
                              'support.tips.expect',
                              'Tell me what you expected vs what happened',
                           )}
                        </strong>
                     </div>
                  </li>
               </ul>

               <div className="pt-4 border-t">
                  <p className="text-sm text-amber-700 font-medium">
                     {t(
                        'support.tips.ps',
                        'The more clear & detailed your message is → the faster I can understand and fix/help.',
                     )}
                  </p>
               </div>
            </CardContent>
         </Card>

         {/* Final CTA */}
         <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">
               {t('support.cta.title', 'Ready to get help?')}
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
               {t(
                  'support.cta.subtitle',
                  'Just send me a message — no forms, no tickets, no waiting in queue. I’m the only one reading them.',
               )}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
               <Button size="lg" asChild>
                  <a href={`"mailto:${myEmail}?subject=Support%20request`}>
                     <Mail className="mr-2 h-5 w-5" />
                     {t('support.cta.email', 'Email me now')}
                  </a>
               </Button>

               <Button variant="outline" size="lg" asChild>
                  <a
                     href="https://twitter.com/AhMeDMaGDY1428"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <Twitter className="mr-2 h-5 w-5" />
                     {t('support.cta.twitter', 'DM me on X')}
                  </a>
               </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-10">
               {t(
                  'support.cta.ps',
                  'Thank you for using and supporting this tiny project — every message helps me make it better.',
               )}
            </p>
         </div>
      </div>
   );
}
