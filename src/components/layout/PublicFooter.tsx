import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { companyAddress, myLocationMapLink } from '../../utils/constants';
import {
   myLinkedinLink,
   myPhoneLink,
   myPhoneNumber,
   myXLink,
   projectEmail,
   projectGithubLink,
} from '../../utils/constants';

export function PublicFooter() {
   const { t } = useTranslation();

   const footerLinks = {
      product: [
         {
            label: t('public footer.product.features', 'Features'),
            href: '#features',
         },
         {
            label: t('public footer.product.pricing', 'Pricing'),
            href: '#pricing',
         },
         {
            label: t('public footer.product.techStack', 'Tech Stack'),
            href: '#tech',
         },
         {
            label: t('public footer.product.roadmap', 'Roadmap'),
            href: '/roadmap',
         },
      ],
      company: [
         {
            label: t('public footer.company.about', 'About Us'),
            href: '/about',
         },
         {
            label: t('public footer.company.careers', 'Careers'),
            href: '/careers',
         },
         { label: t('public footer.company.blog', 'Blog'), href: '/blog' },
         {
            label: t('public footer.company.contact', 'Contact'),
            href: '/contact',
         },
      ],
      resources: [
         {
            label: t('public footer.resources.documentation', 'Documentation'),
            href: '/docs',
         },
         {
            label: t('public footer.resources.apiReference', 'API Reference'),
            href: '/api',
         },
         {
            label: t('public footer.resources.support', 'Support Center'),
            href: '/support',
         },
         {
            label: t('public footer.resources.community', 'Community'),
            href: '/community',
         },
      ],
      legal: [
         {
            label: t('public footer.legal.privacy', 'Privacy Policy'),
            href: '/privacy',
         },
         {
            label: t('public footer.legal.terms', 'Terms of Service'),
            href: '/terms',
         },
         {
            label: t('public footer.legal.cookies', 'Cookie Policy'),
            href: '/cookies',
         },
         {
            label: t('public footer.legal.security', 'Security'),
            href: '/security',
         },
      ],
   };

   const socialLinks = [
      {
         icon: <Github className="h-5 w-5" />,
         href: projectGithubLink,
         label: 'GitHub',
      },
      {
         icon: <Twitter className="h-5 w-5" />,
         href: myXLink,
         label: 'X',
      },
      {
         icon: <Linkedin className="h-5 w-5" />,
         href: myLinkedinLink,
         label: 'LinkedIn',
      },
   ];

   const handleNewsletterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle newsletter subscription
   };

   return (
      <footer className="border-t bg-background">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="py-16 lg:py-20">
               <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                  {/* Company Info & Newsletter */}
                  <div className="lg:col-span-4">
                     {/* Logo & Description */}
                     <Link to="/" className="flex items-center gap-2 mb-6">
                        <img
                           src="/assets/icons/logo.png"
                           className="h-8 w-8 object-contain"
                           alt="Workforce Ultimate Logo"
                        />
                        <span className="text-lg font-semibold">
                           {t(
                              'public footer.companyName',
                              'Workforce Ultimate',
                           )}
                        </span>
                     </Link>
                     <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                        {t(
                           'public footer.description',
                           'Empowering teams with intelligent workforce management solutions. Streamline your operations and boost productivity.',
                        )}
                     </p>

                     {/* Newsletter */}
                     <div className="space-y-3">
                        <h3 className="text-sm font-semibold">
                           {t(
                              'public footer.newsletter.title',
                              'Subscribe to our newsletter',
                           )}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                           {t(
                              'public footer.newsletter.description',
                              'Get the latest updates and news delivered to your inbox.',
                           )}
                        </p>
                        <form
                           onSubmit={handleNewsletterSubmit}
                           className="flex gap-2"
                        >
                           <Input
                              type="email"
                              placeholder={t(
                                 'footer.newsletter.placeholder',
                                 'Enter your email',
                              )}
                              className="flex-1"
                              required
                           />
                           <Button type="submit">
                              {t(
                                 'public footer.newsletter.button',
                                 'Subscribe',
                              )}
                           </Button>
                        </form>
                     </div>

                     {/* Contact Info */}
                     <div className="mt-6 space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                           <Mail className="h-4 w-4" />
                           <a
                              href={`mailto:${projectEmail}`}
                              className="hover:text-primary transition-colors"
                           >
                              {projectEmail}
                           </a>
                        </div>
                        <div className="flex items-center gap-2">
                           <Phone className="h-4 w-4" />
                           <a
                              href={`tel:${myPhoneLink}`}
                              className="hover:text-primary transition-colors"
                           >
                              {myPhoneNumber}
                           </a>
                        </div>
                        <div className="flex items-start gap-2">
                           <MapPin className="h-4 w-4 mt-0.5" />
                           <a
                              href={myLocationMapLink}
                              rel="noopener"
                              className="hover:text-primary transition-colors"
                           >
                              {t('public footer.address', { companyAddress })}
                           </a>
                        </div>
                     </div>
                  </div>

                  {/* Links Grid */}
                  <div className="lg:col-span-8">
                     <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Product Links */}
                        <div>
                           <h3 className="mb-4 text-sm font-semibold">
                              {t('public footer.product.title', 'Product')}
                           </h3>
                           <ul className="space-y-3">
                              {footerLinks.product.map((link, index) => (
                                 <li key={index}>
                                    <a
                                       href={link.href}
                                       className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                       {link.label}
                                    </a>
                                 </li>
                              ))}
                           </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                           <h3 className="mb-4 text-sm font-semibold">
                              {t('public footer.company.title', 'Company')}
                           </h3>
                           <ul className="space-y-3">
                              {footerLinks.company.map((link, index) => (
                                 <li key={index}>
                                    <a
                                       href={link.href}
                                       className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                       {link.label}
                                    </a>
                                 </li>
                              ))}
                           </ul>
                        </div>

                        {/* Resources Links */}
                        <div>
                           <h3 className="mb-4 text-sm font-semibold">
                              {t('public footer.resources.title', 'Resources')}
                           </h3>
                           <ul className="space-y-3">
                              {footerLinks.resources.map((link, index) => (
                                 <li key={index}>
                                    <Link
                                       to={link.href}
                                       className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                       {link.label}
                                    </Link>
                                 </li>
                              ))}
                           </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                           <h3 className="mb-4 text-sm font-semibold">
                              {t('public footer.legal.title', 'Legal')}
                           </h3>
                           <ul className="space-y-3">
                              {footerLinks.legal.map((link, index) => (
                                 <li key={index}>
                                    <Link
                                       to={link.href}
                                       className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                       {link.label}
                                    </Link>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t py-8">
               <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  {/* Copyright */}
                  <p className="text-sm text-muted-foreground">
                     © {new Date().getFullYear()}{' '}
                     {t('public footer.companyName', 'Workforce Ultimate')}.{' '}
                     {t('public footer.copyright', 'All rights reserved.')}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center gap-4">
                     {socialLinks.map((social, index) => (
                        <a
                           key={index}
                           href={social.href}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-muted-foreground transition-colors hover:text-primary"
                           aria-label={social.label}
                        >
                           {social.icon}
                        </a>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </footer>
   );
}
