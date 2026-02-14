import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Rocket, ArrowRight, Mail, BookOpen } from 'lucide-react';
import { Link } from 'react-router';

export default function Page404() {
   const { t } = useTranslation('404');

   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-background to-muted/40 px-4 py-12">
         <div className="text-center max-w-2xl">
            {/* Big 404 */}
            <h1 className="text-8xl md:text-9xl font-black tracking-tighter text-primary/20 mb-4 select-none">
               404
            </h1>

            <div className="mb-8 space-y-4">
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {t('404.title', 'Page not found')}
               </h2>

               <p className="text-xl text-muted-foreground leading-relaxed">
                  {t(
                     '404.subtitle',
                     'Looks like this page took a coffee break… or maybe I just haven’t built it yet.',
                  )}
               </p>

               <p className="text-lg text-muted-foreground/80 italic">
                  {t(
                     '404.soloNote',
                     '(This is still a one-person project — sometimes things go missing while I’m shipping new features)',
                  )}
               </p>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
               <Button size="lg" asChild>
                  <Link to="/">
                     <Home className="mr-2 h-5 w-5" />
                     {t('404.backHome', 'Back to Home')}
                  </Link>
               </Button>

               <Button variant="outline" size="lg" asChild>
                  <Link to="/docs">
                     <BookOpen className="mr-2 h-5 w-5" />
                     {t('404.browseDocs', 'Browse Documentation')}
                  </Link>
               </Button>

               <Button variant="ghost" size="lg" asChild>
                  <Link to="/contact">
                     <Mail className="mr-2 h-5 w-5" />
                     {t('404.report', 'Tell me what broke')}
                  </Link>
               </Button>
            </div>

            {/* Fun easter egg / personality touch */}
            <Card className="max-w-md mx-auto border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
               <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                     <Rocket className="h-10 w-10 text-primary/40 animate-pulse" />
                  </div>

                  <p className="text-muted-foreground">
                     {t(
                        '404.funMessage',
                        'While you’re here… want to help make this project bigger? I’m looking for early collaborators →',
                     )}
                  </p>

                  <Button variant="link" className="mt-2" asChild>
                     <Link to="/careers">
                        {t(
                           '404.careersLink',
                           'See Careers / Collaboration page',
                        )}
                        <ArrowRight className="ml-1.5 h-4 w-4 inline" />
                     </Link>
                  </Button>
               </CardContent>
            </Card>

            {/* Very small footer text */}
            <p className="text-sm text-muted-foreground/60 mt-16">
               {t('404.footer', 'Error 404 — Not Found • Cairo, 2026')}
            </p>
         </div>
      </div>
   );
}
