import { Button } from '@/components/ui/button';
import {
   CardTitle,
   CardHeader,
   CardContent,
   Card,
   CardDescription,
} from '@/components/ui/card';
import {
   AlertTriangle,
   CheckCircle2,
   Code2,
   Heart,
   Mail,
   User,
   Users,
   Twitter,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
export default function CareerPage() {
   const { t } = useTranslation();

   return (
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
         {/* Hero */}
         <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
               <Users className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
               {t('careers.title', 'Careers / Collaboration')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
               {t(
                  'careers.subtitle',
                  'Right now this is a one-person project built in Cairo. But I would love to make it grow faster — and I’m open to the right people joining early.',
               )}
            </p>
         </div>

         <div className="space-y-12 md:space-y-16">
            {/* Current reality */}
            <Card className="border-2 border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <User className="h-6 w-6" />
                     {t('careers.status.title', 'Current stage')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                  <p>
                     {t(
                        'careers.status.p1',
                        'This product is still very early — built, maintained and supported 100% by one person (me). No investors, no team, no office, no HR department.',
                     )}
                  </p>
                  <p>
                     {t(
                        'careers.status.p2',
                        'That means things move fast when I’m focused, but also that I’m the bottleneck for almost everything: new features, bug fixes, support, documentation…',
                     )}
                  </p>
                  <p className="font-medium text-foreground">
                     {t(
                        'careers.status.p3',
                        'If we want to make this project significantly bigger, faster and more reliable — I need help.',
                     )}
                  </p>
               </CardContent>
            </Card>

            {/* Who I'm looking for */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <Code2 className="h-6 w-6" />
                     {t('careers.looking.title', 'Who I’d love to work with')}
                  </CardTitle>
                  <CardDescription className="text-base">
                     {t(
                        'careers.looking.subtitle',
                        'I’m not looking for “employees” in the classic sense right now. I’m looking for co-builders who want to join early and help shape something meaningful.',
                     )}
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                     {[
                        {
                           title: t(
                              'careers.role.frontend',
                              'Frontend / React Developer',
                           ),
                           desc: t(
                              'careers.role.frontendDesc',
                              'You love TypeScript, Tailwind, shadcn/ui, React Query, clean code and making complex UIs feel simple and fast.',
                           ),
                        },
                        {
                           title: t(
                              'careers.role.fullstack',
                              'Full-Stack / Backend Developer',
                           ),
                           desc: t(
                              'careers.role.fullstackDesc',
                              'Strong with Supabase/PostgreSQL, Node.js/Express/NestJS or Python/FastAPI, authentication flows, realtime (websockets), background jobs.',
                           ),
                        },
                        {
                           title: t(
                              'careers.role.designer',
                              'Product Designer / UI/UX',
                           ),
                           desc: t(
                              'careers.role.designerDesc',
                              'You can turn messy ideas into clean, intuitive interfaces. Bonus if you code (Figma → Tailwind is a superpower here).',
                           ),
                        },
                        {
                           title: t(
                              'careers.role.other',
                              'Other passionate builders',
                           ),
                           desc: t(
                              'careers.role.otherDesc',
                              'DevOps, growth/marketing, documentation writer, community person, QA — if you’re excited about this space and want to contribute, let’s talk.',
                           ),
                        },
                     ].map((role, i) => (
                        <div
                           key={i}
                           className="border rounded-lg p-6 hover:border-primary/50 transition-colors"
                        >
                           <h3 className="text-xl font-semibold mb-3">
                              {role.title}
                           </h3>
                           <p className="text-muted-foreground">{role.desc}</p>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* The deal – very transparent */}
            <Card className="border-2 border-amber-500/30 bg-linear-to-br from-amber-500/5 to-transparent">
               <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                     <Heart className="h-6 w-6 text-amber-600" />
                     {t('careers.deal.title', 'What I can offer right now')}
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <ul className="space-y-4 text-lg">
                     <li className="flex gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <span>
                           {t(
                              'careers.deal.revshare',
                              'Revenue share / significant equity — if we grow this together, you get a real piece of it',
                           )}
                        </span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <span>
                           {t(
                              'careers.deal.remote',
                              '100% remote — work from anywhere (I’m in Cairo, timezone flexible)',
                           )}
                        </span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <span>
                           {t(
                              'careers.deal.ownership',
                              'Real ownership — your ideas, code and decisions will shape the product',
                           )}
                        </span>
                     </li>
                     <li className="flex gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                        <span>
                           {t(
                              'careers.deal.fast',
                              'Very fast iteration — no meetings hell, no red tape, ship things quickly',
                           )}
                        </span>
                     </li>
                     <li className="flex gap-3 text-amber-700 font-medium">
                        <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
                        <span>
                           {t(
                              'careers.deal.real',
                              'No salary right now — early stage means high risk + high potential upside',
                           )}
                        </span>
                     </li>
                  </ul>
               </CardContent>
            </Card>

            {/* Call to action */}
            <div className="text-center py-12 md:py-16">
               <h2 className="text-3xl font-bold mb-6">
                  {t('careers.cta.title', 'Interested in joining early?')}
               </h2>

               <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                  {t(
                     'careers.cta.subtitle',
                     'No formal application process. Just write me honestly — tell me who you are, what you’re good at, why this project excites you, and how you think you can help.',
                  )}
               </p>

               <div className="flex flex-wrap justify-center gap-6">
                  <Button size="lg" asChild>
                     <a href="/contact">
                        <Mail className="mr-2 h-5 w-5" />
                        {t('careers.cta.email', 'Write me directly')}
                     </a>
                  </Button>

                  <Button variant="outline" size="lg" asChild>
                     <a
                        href="https://twitter.com/AhMeDMaGDY1428"
                        target="_blank"
                        rel="noopener noreferrer"
                     >
                        <Twitter className="mr-2 h-5 w-5" />
                        {t('careers.cta.twitter', 'DM me on X')}
                     </a>
                  </Button>
               </div>

               <p className="text-sm text-muted-foreground mt-8">
                  {t(
                     'careers.cta.ps',
                     'P.S. Even if you’re not ready to commit full-time — part-time, freelance, code reviews, design feedback, translations, documentation… all welcome.',
                  )}
               </p>
            </div>
         </div>
      </div>
   );
}
