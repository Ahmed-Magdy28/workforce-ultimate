import { useTranslation } from 'react-i18next';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
   BookOpen,
   Code2,
   Terminal,
   HelpCircle,
   Clock,
   ArrowRight,
   Search,
   Mail,
} from 'lucide-react';

export default function DocsPage() {
   const { t } = useTranslation();

   const sections = [
      {
         title: t('docs.userGuide.title', 'User Guide'),
         description: t(
            'docs.userGuide.desc',
            'Step-by-step help for everyday users: setting up your company, adding employees, using work logs, goals, evaluations, etc.',
         ),
         icon: <BookOpen className="h-6 w-6" />,
         href: '/docs/user-guide',
         badge: t('docs.userGuide.badge', 'Most visited'),
         color: 'text-blue-500',
      },
      {
         title: t('docs.api.title', 'API Reference'),
         description: t(
            'docs.api.desc',
            'REST API documentation — endpoints, authentication, rate limits, examples (cURL, JavaScript, Python).',
         ),
         icon: <Code2 className="h-6 w-6" />,
         href: '/api',
         badge: t('docs.api.badge', 'Developers'),
         color: 'text-indigo-500',
      },
      {
         title: t('docs.faq.title', 'Frequently Asked Questions'),
         description: t(
            'docs.faq.desc',
            'Quick answers to common questions about accounts, billing, features, data privacy, limitations, and more.',
         ),
         icon: <HelpCircle className="h-6 w-6" />,
         href: '/faq',
         badge: null,
         color: 'text-green-500',
      },
      {
         title: t('docs.changelog.title', 'Changelog & Updates'),
         description: t(
            'docs.changelog.desc',
            'What’s new, what’s fixed, what’s coming. Every release note written personally.',
         ),
         icon: <Clock className="h-6 w-6" />,
         href: '/changelog',
         badge: t('docs.changelog.badge', 'Latest: v1.2.3 – Feb 10, 2026'),
         color: 'text-purple-500',
      },
      {
         title: t('docs.developer.title', 'Developer & Integration Guide'),
         description: t(
            'docs.developer.desc',
            'Custom integrations, webhooks, Zapier / Make.com setup, embed options, and advanced usage tips.',
         ),
         icon: <Terminal className="h-6 w-6" />,
         href: '/docs/developer',
         badge: t('docs.developer.badge', 'Advanced'),
         color: 'text-orange-500',
      },
   ];

   return (
      <div className="container max-w-5xl mx-auto px-4 py-12 md:py-20">
         {/* Header */}
         <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
               <BookOpen className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
               {t('docs.title', 'Documentation & Help Center')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
               {t(
                  'docs.subtitle',
                  'Everything you need to use, integrate with, or extend this product — written clearly by the one person building it.',
               )}
            </p>

            {/* Quick search bar (placeholder — can be functional later) */}
            <div className="mt-10 max-w-2xl mx-auto relative">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                     type="text"
                     placeholder={t(
                        'docs.search.placeholder',
                        'Search documentation…',
                     )}
                     className="w-full pl-12 pr-4 py-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
               </div>
               <p className="text-xs text-muted-foreground mt-2 text-center">
                  {t(
                     'docs.search.hint',
                     'Try: "add employee", "reset password", "API authentication"',
                  )}
               </p>
            </div>
         </div>

         {/* Main sections grid */}
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, i) => (
               <Card
                  key={i}
                  className="border-2 transition-all hover:border-primary/50 hover:shadow-lg flex flex-col h-full"
               >
                  <CardHeader>
                     <div className="flex items-center justify-between mb-3">
                        <div
                           className={`p-3 rounded-lg ${section.color.replace('text-', 'bg-').replace('-500', '-500/10')}`}
                        >
                           {section.icon}
                        </div>
                        {section.badge && (
                           <Badge variant="secondary" className="text-xs">
                              {section.badge}
                           </Badge>
                        )}
                     </div>

                     <CardTitle className="text-2xl">{section.title}</CardTitle>
                     <CardDescription className="text-base mt-2">
                        {section.description}
                     </CardDescription>
                  </CardHeader>

                  <CardContent className="mt-auto pt-2">
                     <Button
                        variant="ghost"
                        className="group w-full justify-end"
                        asChild
                     >
                        <a href={section.href}>
                           {t('docs.readMore', 'Explore this section')}
                           <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                     </Button>
                  </CardContent>
               </Card>
            ))}
         </div>

         {/* Additional help / contact CTA */}
         <div className="text-center mt-16 md:mt-24 bg-muted/40 rounded-2xl p-10 md:p-16">
            <h2 className="text-3xl font-bold mb-6">
               {t('docs.stillNeed.title', 'Still need help?')}
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
               {t(
                  'docs.stillNeed.subtitle',
                  'Can’t find what you’re looking for? Just reach out — I personally read and answer every message.',
               )}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
               <Button size="lg" asChild>
                  <a href="/support">
                     <HelpCircle className="mr-2 h-5 w-5" />
                     {t('docs.stillNeed.support', 'Go to Support Page')}
                  </a>
               </Button>

               <Button variant="outline" size="lg" asChild>
                  <a href="/contact">
                     <Mail className="mr-2 h-5 w-5" />
                     {t('docs.stillNeed.contact', 'Email me directly')}
                  </a>
               </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-10">
               {t(
                  'docs.stillNeed.ps',
                  'P.S. If you notice something missing or unclear in the docs — please tell me. It helps everyone.',
               )}
            </p>
         </div>
      </div>
   );
}
