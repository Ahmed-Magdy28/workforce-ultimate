import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
   Mail,
   Linkedin,
   Twitter,
   Github,
   Heart,
   Coffee,
   Code2,
   Rocket,
   Globe,
} from 'lucide-react';

export default function AboutPage() {
   const { t } = useTranslation();

   return (
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
         {/* Hero Section */}
         <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
               <Rocket className="h-10 w-10 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
               {t('about.title', 'Built by one person — for people like you')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
               {t(
                  'about.subtitle',
                  'Hi, I’m Ahmed — the only human writing code, answering support, fixing bugs, making coffee, and dreaming about this product at 3 a.m.',
               )}
            </p>
         </div>

         {/* Main Story */}
         <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="space-y-8">
               <h2 className="text-3xl font-bold">
                  {t('about.story', 'The story behind this project')}
               </h2>

               <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                  <p>
                     {t(
                        'about.p1',
                        'Like many solo founders, I got tired of using five different tools to manage even the simplest team/HR processes — and most of them were either too expensive, too complicated, or clearly not built by someone who actually uses them.',
                     )}
                  </p>

                  <p>
                     {t(
                        'about.p2',
                        'So in 2025 I decided to stop complaining and start building something I would actually want to use myself: clean, fast, honest, affordable, and made for small-to-medium teams that don’t have (and don’t want) a full HR department.',
                     )}
                  </p>

                  <p className="font-medium text-foreground">
                     {t(
                        'about.p3',
                        'This is still very much version 1.x — but it’s improving every week because I use it myself every day.',
                     )}
                  </p>
               </div>
            </div>

            {/* Right side – values / personality */}
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <Heart className="h-6 w-6 text-red-500" />
                     {t('about.values', 'What I care about')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6 pt-2">
                  <div className="space-y-4">
                     {[
                        {
                           icon: <Code2 className="h-5 w-5" />,
                           title: t(
                              'about.value1',
                              'Clean & maintainable code',
                           ),
                           desc: t(
                              'about.value1desc',
                              'Because I have to fix it at 2 a.m. when something breaks',
                           ),
                        },
                        {
                           icon: <Coffee className="h-5 w-5" />,
                           title: t('about.value2', 'Honest pricing'),
                           desc: t(
                              'about.value2desc',
                              'No hidden per-seat tricks, no enterprise bait-and-switch',
                           ),
                        },
                        {
                           icon: <Globe className="h-5 w-5" />,
                           title: t(
                              'about.value3',
                              'Works in Arabic & English (RTL included)',
                           ),
                           desc: t(
                              'about.value3desc',
                              'Because I live in Cairo and many of my early users do too',
                           ),
                        },
                        {
                           icon: <Rocket className="h-5 w-5" />,
                           title: t(
                              'about.value4',
                              'Speed over features (for now)',
                           ),
                           desc: t(
                              'about.value4desc',
                              '50 ms response is more important than 50 new settings',
                           ),
                        },
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                           <div className="mt-1 text-primary">{item.icon}</div>
                           <div>
                              <h4 className="font-semibold">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                 {item.desc}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Connect / Contact */}
         <Card className="text-center p-8 md:p-12 border-2">
            <h2 className="text-3xl font-bold mb-6">
               {t('about.connect', 'Want to talk?')}
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
               {t(
                  'about.connectDesc',
                  'I read every message. Whether it’s feedback, a bug, a feature idea, or just saying hi — I’ll answer personally.',
               )}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
               <Button variant="outline" size="lg" asChild>
                  <a
                     href="mailto:ahmed@example.com"
                     className="flex items-center gap-2"
                  >
                     <Mail className="h-5 w-5" />
                     {t('about.email', 'Email me')}
                  </a>
               </Button>

               <Button variant="outline" size="lg" asChild>
                  <a
                     href="https://twitter.com/AhMeDMaGDY1428"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-2"
                  >
                     <Twitter className="h-5 w-5" />
                     Twitter / X
                  </a>
               </Button>

               <Button variant="outline" size="lg" asChild>
                  <a
                     href="https://github.com/yourusername"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-2"
                  >
                     <Github className="h-5 w-5" />
                     GitHub
                  </a>
               </Button>

               <Button variant="outline" size="lg" asChild>
                  <a
                     href="https://linkedin.com/in/yourprofile"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-2"
                  >
                     <Linkedin className="h-5 w-5" />
                     LinkedIn
                  </a>
               </Button>
            </div>

            <p className="text-sm text-muted-foreground">
               {t(
                  'about.madeWith',
                  'Made with love, too much coffee, and a lot of late nights in Cairo • 2025–2026',
               )}
            </p>
         </Card>
      </div>
   );
}
