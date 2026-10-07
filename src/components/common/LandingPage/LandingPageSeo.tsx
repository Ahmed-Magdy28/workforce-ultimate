'use client';

import { useTranslation } from 'react-i18next';
import {
   myEmail,
   myLinkedinLink,
   myPhoneNumber,
   myXLink,
   projectGithubLink,
   siteUrl,
} from '@/utils/constants';

export default function LandingPageSeo() {
   const { t } = useTranslation('landing');

   const pageDescription = t(
      'landing page seo.landing.description',
      'Transform your team productivity with Workforce Ultimate. Comprehensive platform for managing employees, projects, and tasks with real-time analytics, performance tracking, and seamless collaboration.',
   );

   return (
      <>
         {/* Schema.org Structured Data */}
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
               __html: JSON.stringify({
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
               }),
            }}
         />

         {/* Organization Schema */}
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
               __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'Organization',
                  name: 'Workforce Ultimate',
                  url: siteUrl,
                  logo: `${siteUrl}/logo.png`,
                  description: pageDescription,
                  contactPoint: {
                     '@type': 'ContactPoint',
                     telephone: myPhoneNumber,
                     contactType: 'Customer Service',
                     email: myEmail,
                     availableLanguage: ['English', 'Arabic'],
                  },
                  sameAs: [myXLink, myLinkedinLink, projectGithubLink],
               }),
            }}
         />

         {/* Breadcrumb Schema */}
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
               __html: JSON.stringify({
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
               }),
            }}
         />
      </>
   );
}
