import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
   CheckCircle2,
   Users,
   FolderKanban,
   BarChart3,
   ArrowRight,
} from 'lucide-react';

export function HeroSection() {
   const { t } = useTranslation('landing');

   const features = [
      {
         icon: <Users className="h-5 w-5" />,
         text: t(
            'hero Section.feature1',
            'Multi-level user hierarchy & permissions',
         ),
      },
      {
         icon: <FolderKanban className="h-5 w-5" />,
         text: t('hero Section.feature2', 'Advanced project & task management'),
      },
      {
         icon: <BarChart3 className="h-5 w-5" />,
         text: t(
            'hero Section.feature3',
            'Real-time performance tracking & analytics',
         ),
      },
   ];

   return (
      <section
         id="hero"
         className="relative overflow-hidden bg-linear-to-b from-background to-muted/20"
      >
         {/* Background decoration */}
         <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-20">
               <div className="aspect-square w-200 rounded-full bg-primary/30" />
            </div>
         </div>

         <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
               {/* Left Content */}
               <div className="flex flex-col gap-8">
                  {/* Badge */}
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm backdrop-blur">
                     <CheckCircle2 className="h-4 w-4 text-primary" />
                     <span className="font-medium">
                        {t(
                           'hero Section.badge',
                           'Enterprise-Grade Workforce Management',
                        )}
                     </span>
                  </div>

                  {/* Heading */}
                  <div className="space-y-4">
                     <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        {t('hero Section.title1', 'Transform Your')} <br />
                        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                           {t('hero Section.title2', 'Team Productivity')}
                        </span>
                     </h1>
                     <p className="text-lg text-muted-foreground sm:text-xl max-w-xl">
                        {t(
                           'hero Section.description',
                           'A comprehensive platform for managing employees, projects, and tasks. Boost productivity, streamline communication, and track performance—all in one place.',
                        )}
                     </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                     {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              {feature.icon}
                           </div>
                           <span className="text-sm font-medium sm:text-base">
                              {feature.text}
                           </span>
                        </div>
                     ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
                     <Button size="lg" asChild className="group">
                        <Link to="/signup">
                           {t('hero Section.cta', 'Get Started Free')}
                           <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                     </Button>
                     <Button size="lg" variant="outline" asChild>
                        <a href="#features">
                           {t('hero Section.learnMore', 'Learn More')}
                        </a>
                     </Button>
                  </div>

                  {/* Social Proof */}
                  <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                     <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>
                           {t('hero Section.proof1', 'No credit card required')}
                        </span>
                     </div>
                     <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>
                           {t('hero Section.proof2', 'Free 14-day trial')}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Right Content - Visual */}
               <div className="relative lg:block hidden">
                  <div className="relative rounded-2xl border bg-background/40 p-8 shadow-2xl backdrop-blur">
                     {/* Dashboard Preview Mockup */}
                     <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                           <div className="h-8 w-32 rounded bg-primary/20 animate-pulse" />
                           <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-3 gap-4">
                           {[1, 2, 3].map((i) => (
                              <div
                                 key={i}
                                 className="space-y-2 rounded-lg border bg-card p-4"
                              >
                                 <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                                 <div className="h-8 w-12 rounded bg-muted animate-pulse" />
                              </div>
                           ))}
                        </div>

                        {/* Task List */}
                        <div className="space-y-3 pt-4">
                           {[1, 2, 3, 4].map((i) => (
                              <div
                                 key={i}
                                 className="flex items-center gap-3 rounded-lg border bg-card p-3"
                              >
                                 <div className="h-5 w-5 rounded bg-primary/20" />
                                 <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
                                 <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Floating elements */}
                     <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                     <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
