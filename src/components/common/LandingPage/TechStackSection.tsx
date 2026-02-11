import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export function TechStackSection() {
   const { t } = useTranslation();

   const technologies = [
      {
         category: t(
            'techStack Section.frontend.category',
            'Frontend Framework',
         ),
         items: [
            {
               name: 'React',
               description: t(
                  'techStack Section.frontend.react',
                  'A JavaScript library for building user interfaces',
               ),
               logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
               docsUrl: 'https://react.dev/',
               color: 'text-[#61DAFB]',
            },
            {
               name: 'TypeScript',
               description: t(
                  'techStack Section.frontend.typescript',
                  'Typed superset of JavaScript',
               ),
               logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
               docsUrl: 'https://www.typescriptlang.org/docs/',
               color: 'text-[#3178C6]',
            },
            {
               name: 'Vite',
               description: t(
                  'techStack Section.frontend.vite',
                  'Next generation frontend tooling',
               ),
               logo: 'https://vitejs.dev/logo.svg',
               docsUrl: 'https://vitejs.dev/',
               color: 'text-[#646CFF]',
            },
         ],
      },
      {
         category: t('techStack Section.styling.category', 'Styling & UI'),
         items: [
            {
               name: 'Tailwind CSS',
               description: t(
                  'techStack Section.styling.tailwind',
                  'Utility-first CSS framework',
               ),
               logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
               docsUrl: 'https://tailwindcss.com/docs',
               color: 'text-[#06B6D4]',
            },
            {
               name: 'shadcn/ui',
               description: t(
                  'techStack Section.styling.shadcn',
                  'Re-usable components built with Radix UI',
               ),
               logo: 'https://ui.shadcn.com/favicon.ico',
               docsUrl: 'https://ui.shadcn.com/',
               color: 'text-black dark:text-white',
            },
            {
               name: 'Lucide Icons',
               description: t(
                  'techStack Section.styling.lucide',
                  'Beautiful & consistent icons',
               ),
               logo: 'https://lucide.dev/logo.svg',
               docsUrl: 'https://lucide.dev/',
               color: 'text-[#F56565]',
            },
         ],
      },
      {
         category: t('techStack Section.state.category', 'State Management'),
         items: [
            {
               name: 'Redux Toolkit',
               description: t(
                  'techStack Section.state.redux',
                  'Official Redux toolset for efficient development',
               ),
               logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
               docsUrl: 'https://redux-toolkit.js.org/',
               color: 'text-[#764ABC]',
            },
            {
               name: 'TanStack Query',
               description: t(
                  'techStack Section.state.reactQuery',
                  'Powerful data synchronization for React',
               ),
               logo: 'https://raw.githubusercontent.com/TanStack/query/main/media/emblem-light.svg',
               docsUrl: 'https://tanstack.com/query/latest',
               color: 'text-[#FF4154]',
            },
         ],
      },
      {
         category: t(
            'techStack Section.backend.category',
            'Backend & Database',
         ),
         items: [
            {
               name: 'Supabase',
               description: t(
                  'techStack Section.backend.supabase',
                  'Open source Firebase alternative',
               ),
               logo: 'https://supabase.com/favicon/favicon-32x32.png',
               docsUrl: 'https://supabase.com/docs',
               color: 'text-[#3ECF8E]',
            },
         ],
      },
      {
         category: t('techStack Section.routing.category', 'Routing & Forms'),
         items: [
            {
               name: 'React Router',
               description: t(
                  'techStack Section.routing.reactRouter',
                  'Declarative routing for React',
               ),
               logo: 'https://reactrouter.com/favicon-light.png',
               docsUrl: 'https://reactrouter.com/',
               color: 'text-[#CA4245]',
            },
            {
               name: 'React Hook Form',
               description: t(
                  'techStack Section.routing.reactHookForm',
                  'Performant form validation',
               ),
               logo: 'https://react-hook-form.com/images/logo/react-hook-form-logo-only.png',
               docsUrl: 'https://react-hook-form.com/',
               color: 'text-[#EC5990]',
            },
            {
               name: 'Zod',
               description: t(
                  'techStack Section.routing.zod',
                  'TypeScript-first schema validation',
               ),
               logo: 'https://zod.dev/_next/image?url=%2Flogo%2Flogo-glow.png&w=256&q=100',
               docsUrl: 'https://zod.dev/',
               color: 'text-[#3E67B1]',
            },
         ],
      },
      {
         category: t('techStack Section.utilities.category', 'Utilities'),
         items: [
            {
               name: 'i18next',
               description: t(
                  'techStack Section.utilities.i18next',
                  'Internationalization framework',
               ),
               logo: 'https://www.i18next.com/~gitbook/image?url=https%3A%2F%2F286188001-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-L9iS6Wm2hynS5H9Gj7j%252Favatar.png%3Fgeneration%3D1523462254548780%26alt%3Dmedia&width=32&dpr=1&quality=100&sign=8c4f54cf&sv=2',
               docsUrl: 'https://www.i18next.com/',
               color: 'text-[#26A69A]',
            },
            {
               name: 'React Hot Toast',
               description: t(
                  'techStack Section.utilities.toast',
                  'Smoking hot notifications',
               ),
               logo: 'https://raw.githubusercontent.com/timolins/react-hot-toast/main/assets/header.svg',
               docsUrl: 'https://react-hot-toast.com/',
               color: 'text-[#FF6B35]',
            },
            {
               name: 'React Helmet Async',
               description: t(
                  'techStack Section.utilities.helmet',
                  'Manage document head for SEO',
               ),
               logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
               docsUrl: 'https://github.com/staylor/react-helmet-async',
               color: 'text-[#61DAFB]',
            },
         ],
      },
   ];

   return (
      <section id="tech" className="py-20 sm:py-24 lg:py-32 bg-muted/30">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mx-auto max-w-2xl text-center mb-16">
               <Badge variant="outline" className="mb-4">
                  {t('techStack Section.badge', 'Technology Stack')}
               </Badge>
               <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">
                  {t('techStack Section.heading', 'Built with')} <br />
                  <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                     {t(
                        'techStack Section.headingHighlight',
                        'Modern Technologies',
                     )}
                  </span>
               </h2>
               <p className="text-lg text-muted-foreground">
                  {t(
                     'techStack Section.subheading',
                     'We use industry-leading tools and frameworks to deliver a fast, reliable, and scalable platform.',
                  )}
               </p>
            </div>

            {/* Tech Stack Grid */}
            <div className="space-y-12">
               {technologies.map((tech, categoryIndex) => (
                  <div key={categoryIndex}>
                     <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <div className="h-1 w-8 bg-primary rounded-full" />
                        {tech.category}
                     </h3>
                     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tech.items.map((item, itemIndex) => (
                           <Card
                              key={itemIndex}
                              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50"
                           >
                              <a
                                 href={item.docsUrl}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="block"
                              >
                                 <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                       {/* Logo */}
                                       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-background border">
                                          <img
                                             src={item.logo}
                                             alt={`${item.name} logo`}
                                             className="h-8 w-8 object-contain"
                                             onError={(e) => {
                                                e.currentTarget.style.display =
                                                   'none';
                                             }}
                                          />
                                       </div>

                                       {/* Content */}
                                       <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between gap-2 mb-2">
                                             <h4
                                                className={`font-semibold ${item.color}`}
                                             >
                                                {item.name}
                                             </h4>
                                             <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                          </div>
                                          <p className="text-sm text-muted-foreground line-clamp-2">
                                             {item.description}
                                          </p>
                                       </div>
                                    </div>

                                    {/* Hover effect */}
                                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                                 </CardContent>
                              </a>
                           </Card>
                        ))}
                     </div>
                  </div>
               ))}
            </div>

            {/* Bottom Stats/Info */}
            <div className="mt-16 grid gap-6 sm:grid-cols-3 text-center">
               <div className="rounded-lg border bg-card p-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                     100%
                  </div>
                  <p className="text-sm text-muted-foreground">
                     {t(
                        'techStack Section.stats.typescript',
                        'TypeScript Coverage',
                     )}
                  </p>
               </div>
               <div className="rounded-lg border bg-card p-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                     {t('techStack Section.stats.openSource', 'Open Source')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                     {t(
                        'techStack.stats.openSourceDesc',
                        'Built with open technologies',
                     )}
                  </p>
               </div>
               <div className="rounded-lg border bg-card p-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                     {t('techStack Section.stats.modern', 'Modern')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                     {t(
                        'techStack Section.stats.modernDesc',
                        'Latest stable versions',
                     )}
                  </p>
               </div>
            </div>
         </div>
      </section>
   );
}
