import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
   MessageCircle,
   Users,
   Heart,
   Twitter,
   Send,
   Mail,
   ArrowRight,
   Globe,
   CheckCircle2,
} from 'lucide-react';
import { projectGithubLink } from '@/utils/constants';

export default function CommunityPage() {
   const { t } = useTranslation();

   return (
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
         {/* Hero */}
         <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
               <Users className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
               {t('community.title', 'Community')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
               {t(
                  'community.subtitle',
                  'This project is still very young and built by one person. A small, kind community can help it grow 10× faster — through ideas, feedback, translations, bug reports, or just cheering from the sidelines.',
               )}
            </p>
         </div>

         <div className="grid md:grid-cols-2 gap-10 lg:gap-12 mb-16 md:mb-20">
            {/* Where to connect */}
            <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <MessageCircle className="h-6 w-6" />
                     {t('community.connect.title', 'Where to find & join us')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-4">
                     {[
                        {
                           icon: <Twitter className="h-5 w-5 text-sky-500" />,
                           name: 'X / Twitter',
                           linkText: '@AhMeDMaGDY1428',
                           href: 'https://twitter.com/AhMeDMaGDY1428',
                           desc: t(
                              'community.connect.twitter',
                              'Quick updates, polls, behind-the-scenes, and casual chats',
                           ),
                        },
                        {
                           icon: <Send className="h-5 w-5 text-blue-500" />,
                           name: 'Telegram Group',
                           linkText: t(
                              'community.connect.telegram',
                              '(coming soon)',
                           ),
                           href: '#',
                           desc: t(
                              'community.connect.telegramDesc',
                              'Planned for real-time discussions — join waitlist if interested',
                           ),
                           disabled: true,
                        },
                        {
                           icon: <Globe className="h-5 w-5" />,
                           name: t(
                              'community.connect.github',
                              'GitHub Discussions',
                           ),
                           linkText: projectGithubLink,
                           href: 'https://github.com/yourusername/yourproject/discussions',
                           desc: t(
                              'community.connect.githubDesc',
                              'Feature requests, bug reports, ideas — best place for technical conversations',
                           ),
                        },
                        {
                           icon: <Mail className="h-5 w-5" />,
                           name: t('community.connect.email', 'Direct email'),
                           linkText: 'ahmed@example.com',
                           href: 'mailto:ahmed@example.com?subject=Community%20question%20or%20idea',
                           desc: t(
                              'community.connect.emailDesc',
                              'Private questions, longer feedback, or if you prefer not to post publicly',
                           ),
                        },
                     ].map((item, i) => (
                        <Button
                           key={i}
                           variant="outline"
                           className="w-full justify-start gap-4 h-auto py-5 px-6"
                           asChild
                           disabled={item.disabled}
                        >
                           <a
                              href={item.href}
                              target={
                                 item.href.startsWith('http')
                                    ? '_blank'
                                    : undefined
                              }
                              rel="noopener noreferrer"
                           >
                              {item.icon}
                              <div className="text-left">
                                 <div className="font-medium">{item.name}</div>
                                 <div className="text-sm text-muted-foreground">
                                    {item.linkText}
                                 </div>
                              </div>
                              <ArrowRight className="ml-auto h-5 w-5 opacity-50" />
                           </a>
                        </Button>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* What kind of community we want */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <Heart className="h-6 w-6 text-red-500" />
                     {t('community.values.title', 'What this community values')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <ul className="space-y-5 text-lg">
                     <li className="flex gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                        <span>
                           {t(
                              'community.values.kind',
                              'Kindness and respect — no toxicity, gatekeeping or drama',
                           )}
                        </span>
                     </li>
                     <li className="flex gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                        <span>
                           {t(
                              'community.values.honest',
                              'Honest feedback — even (especially) if it’s critical',
                           )}
                        </span>
                     </li>
                     <li className="flex gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                        <span>
                           {t(
                              'community.values.help',
                              'Helping each other — experienced users helping newcomers',
                           )}
                        </span>
                     </li>
                     <li className="flex gap-4">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                        <span>
                           {t(
                              'community.values.build',
                              'Building in public — sharing wins, fails, and lessons',
                           )}
                        </span>
                     </li>
                  </ul>

                  <div className="pt-4 border-t">
                     <p className="text-sm text-muted-foreground italic">
                        {t(
                           'community.values.ps',
                           'P.S. This is not a huge polished Discord with 10k members (yet). It’s small, personal, and human — just how I like it for now.',
                        )}
                     </p>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Call to action */}
         <div className="text-center py-12 md:py-16 bg-muted/40 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6">
               {t(
                  'community.join.title',
                  'Want to be part of this early community?',
               )}
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
               {t(
                  'community.join.subtitle',
                  'No pressure, no big commitment. Just show up, say hi, share an idea, report something annoying, or help someone else — every small action counts.',
               )}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
               <Button size="lg" asChild>
                  <a
                     href="https://twitter.com/AhMeDMaGDY1428"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <Twitter className="mr-2 h-5 w-5" />
                     {t('community.join.twitter', 'Follow & say hi on X')}
                  </a>
               </Button>

               <Button variant="outline" size="lg" asChild>
                  <a href="/contact">
                     <Mail className="mr-2 h-5 w-5" />
                     {t('community.join.email', 'Email me your thoughts')}
                  </a>
               </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-10">
               {t(
                  'community.join.ps',
                  'Thank you in advance — even just reading this page and thinking “this guy is trying hard” already means a lot.',
               )}
            </p>
         </div>
      </div>
   );
}
