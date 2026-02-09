import { FeaturesSection } from '@/components/common/FeaturesSection';
import { HeroSection } from '../../components/common/HeroSection';
import { PricingSection } from '@/components/common/PricingSection';
import { TechStackSection } from '@/components/common/TechStackSection';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
   myEmail,
   myLinkedinLink,
   myPhoneNumber,
   myXLink,
   projectGithubLink,
   siteUrl,
} from '@/utils/constants';
export default function LandingPage() {
   const { t, i18n } = useTranslation();
   const currentLang = i18n.language;

   // SEO metadata
   // Replace with your actual domain
   const pageTitle = t(
      'landing page seo.landing.title',
      'Workforce Ultimate - Employee & Project Management Platform',
   );
   const pageDescription = t(
      'landing page seo.landing.description',
      'Transform your team productivity with Workforce Ultimate. Comprehensive platform for managing employees, projects, and tasks with real-time analytics, performance tracking, and seamless collaboration.',
   );
   const keywords = t(
      'landing page seo.landing.keywords',
      'workforce management, project management, employee management, task tracking, team collaboration, performance analytics, project tracking software, employee productivity, task management system',
   );
   return (
      <>
         <Helmet>
            {/* Primary Meta Tags */}
            <html lang={currentLang} />
            <title>{pageTitle}</title>
            <meta name="title" content={pageTitle} />
            <meta name="description" content={pageDescription} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content="Workforce Ultimate" />
            <meta name="robots" content="index, follow" />
            <meta
               name="language"
               content={currentLang === 'ar' ? 'Arabic' : 'English'}
            />
            <meta name="revisit-after" content="7 days" />

            {/* Canonical URL */}
            <link rel="canonical" href={`${siteUrl}/${currentLang}`} />

            {/* Alternate Language URLs */}
            <link rel="alternate" hrefLang="en" href={`${siteUrl}/en`} />
            <link rel="alternate" hrefLang="ar" href={`${siteUrl}/ar`} />
            <link rel="alternate" hrefLang="x-default" href={siteUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${siteUrl}/${currentLang}`} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={pageDescription} />
            <meta property="og:image" content={`${siteUrl}/og-image.png`} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta
               property="og:image:alt"
               content="Workforce Ultimate Platform Preview"
            />
            <meta property="og:site_name" content="Workforce Ultimate" />
            <meta
               property="og:locale"
               content={currentLang === 'ar' ? 'ar_EG' : 'en_US'}
            />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={`${siteUrl}/${currentLang}`} />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={pageDescription} />
            <meta
               name="twitter:image"
               content={`${siteUrl}/twitter-image.png`}
            />
            <meta
               name="twitter:image:alt"
               content="Workforce Ultimate Platform"
            />
            <meta name="twitter:creator" content="@workforceultimate" />
            <meta name="twitter:site" content="@workforceultimate" />

            {/* Additional Meta Tags */}
            <meta name="theme-color" content="#000000" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
               name="apple-mobile-web-app-status-bar-style"
               content="black-translucent"
            />
            <meta
               name="apple-mobile-web-app-title"
               content="Workforce Ultimate"
            />

            {/* Schema.org Structured Data */}
            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'SoftwareApplication',
                  name: 'Workforce Ultimate',
                  applicationCategory: 'BusinessApplication',
                  operatingSystem: 'Web',
                  offers: {
                     '@type': 'Offer',
                     price: '29',
                     priceCurrency: 'USD',
                     priceValidUntil: '2026-12-31',
                  },
                  aggregateRating: {
                     '@type': 'AggregateRating',
                     ratingValue: '4.8',
                     ratingCount: '1250',
                  },
                  description: pageDescription,
                  url: siteUrl,
                  image: `${siteUrl}/og-image.png`,
                  author: {
                     '@type': 'Organization',
                     name: 'Workforce Ultimate',
                  },
                  featureList: [
                     'Multi-level user hierarchy',
                     'Project management',
                     'Task tracking',
                     'Performance analytics',
                     'Team collaboration',
                     'Real-time notifications',
                  ],
               })}
            </script>

            {/* Organization Schema */}
            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'Workforce Ultimate',
                  url: siteUrl,
                  logo: `${siteUrl}/logo.png`,
                  description: pageDescription,
                  contactPoint: {
                     '@type': 'ContactPoint',
                     telephone: { myPhoneNumber },
                     contactType: 'Customer Service',
                     email: { myEmail },
                     availableLanguage: ['English', 'Arabic'],
                  },
                  sameAs: [
                     { myXLink },
                     { myLinkedinLink },
                     { projectGithubLink },
                  ],
               })}
            </script>

            {/* Breadcrumb Schema */}
            <script type="application/ld+json">
               {JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                     {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: siteUrl,
                     },
                  ],
               })}
            </script>
         </Helmet>
         <HeroSection />
         <FeaturesSection />
         <PricingSection />
         <TechStackSection />
      </>
   );
}
