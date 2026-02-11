import { useTranslation } from 'react-i18next';
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';

type BlogPost = {
   slug: string;
   title: string;
   description: string;
   date: string;
   readTime: string;
   tags: string[];
   isNew?: boolean;
};

export default function BlogPage() {
   const { t } = useTranslation();

   // Placeholder posts — replace with real data later (mdx, cms, supabase, etc.)
   const posts: BlogPost[] = [
      {
         slug: 'v1-launch-reflection',
         title: t(
            'blog.posts.launch.title',
            'What I Learned Launching v1 as a Solo Developer',
         ),
         description: t(
            'blog.posts.launch.desc',
            'The good, the bad, the bugs I fixed at 3 a.m., and why I decided to build in public from day one.',
         ),
         date: 'Feb 10, 2026',
         readTime: '8 min',
         tags: ['launch', 'indie', 'lessons'],
         isNew: true,
      },
      {
         slug: 'why-rtl-matters',
         title: t(
            'blog.posts.rtl.title',
            'Why RTL Support Was Non-Negotiable From Day One',
         ),
         description: t(
            'blog.posts.rtl.desc',
            'Building for Arabic users isn’t an afterthought — it’s a core requirement. Here’s how I approached it in React + Tailwind.',
         ),
         date: 'Jan 28, 2026',
         readTime: '6 min',
         tags: ['rtl', 'i18n', 'tailwind'],
      },
      {
         slug: 'supabase-vs-firebase-2026',
         title: t(
            'blog.posts.supabase.title',
            'Supabase vs Firebase in 2026 — My Choice & Trade-offs',
         ),
         description: t(
            'blog.posts.supabase.desc',
            'After using both in side projects, here’s an honest comparison now that Supabase has matured significantly.',
         ),
         date: 'Jan 15, 2026',
         readTime: '12 min',
         tags: ['supabase', 'backend', 'comparison'],
      },
      {
         slug: 'building-in-public',
         title: t(
            'blog.posts.public.title',
            'Why I’m Building This in Public (and Why You Might Too)',
         ),
         description: t(
            'blog.posts.public.desc',
            'Transparency, feedback loops, accountability — and yes, the occasional embarrassment. My experience so far.',
         ),
         date: 'Dec 20, 2025',
         readTime: '5 min',
         tags: ['indiehacker', 'build-in-public'],
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
               {t('blog.title', 'Blog & Updates')}
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
               {t(
                  'blog.subtitle',
                  'Thoughts, lessons, technical deep-dives and behind-the-scenes stories from building this product solo.',
               )}
            </p>
         </div>

         {/* Blog Posts Grid */}
         <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
            {posts.map((post) => (
               <Card
                  key={post.slug}
                  className="overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg flex flex-col h-full"
               >
                  <CardHeader className="pb-4">
                     <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <Calendar className="h-4 w-4" />
                           <time dateTime={post.date}>{post.date}</time>
                           <span>•</span>
                           <Clock className="h-4 w-4" />
                           <span>{post.readTime}</span>
                        </div>

                        {post.isNew && (
                           <Badge
                              variant="secondary"
                              className="bg-primary/10 text-primary hover:bg-primary/20"
                           >
                              {t('blog.new', 'New')}
                           </Badge>
                        )}
                     </div>

                     <CardTitle className="text-2xl leading-tight">
                        <a
                           href={`/blog/${post.slug}`}
                           className="hover:text-primary transition-colors"
                        >
                           {post.title}
                        </a>
                     </CardTitle>

                     <CardDescription className="text-base mt-3 line-clamp-3">
                        {post.description}
                     </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 mt-auto">
                     <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag) => (
                           <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                           >
                              {tag}
                           </Badge>
                        ))}
                     </div>
                  </CardContent>

                  <CardFooter className="pt-4 border-t bg-muted/40">
                     <Button variant="ghost" className="ml-auto group" asChild>
                        <a href={`/blog/${post.slug}`}>
                           {t('blog.readMore', 'Read article')}
                           <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                     </Button>
                  </CardFooter>
               </Card>
            ))}
         </div>

         {/* Empty state / coming soon */}
         {posts.length === 0 && (
            <div className="text-center py-20">
               <BookOpen className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
               <h2 className="text-2xl font-semibold mb-3">
                  {t('blog.empty.title', 'No posts yet')}
               </h2>
               <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {t(
                     'blog.empty.desc',
                     'I’m still heads-down building the product. First blog posts coming soon — probably about launch lessons, tech choices, and mistakes I made along the way.',
                  )}
               </p>
               <Button asChild>
                  <a href="/contact">
                     {t('blog.empty.contact', 'Get notified when I publish')}
                  </a>
               </Button>
            </div>
         )}

         {/* Footer call-to-action */}
         <div className="text-center mt-16 md:mt-24">
            <p className="text-muted-foreground mb-6">
               {t(
                  'blog.footer',
                  'Want updates when new articles are published? No spam — just occasional emails.',
               )}
            </p>
            <Button variant="outline" size="lg" asChild>
               <a href="/contact">
                  {t('blog.subscribe', 'Subscribe to updates')}
               </a>
            </Button>
         </div>
      </div>
   );
}
