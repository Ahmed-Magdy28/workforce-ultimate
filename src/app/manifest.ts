import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
   return {
      name: 'Workforce Ultimate',
      short_name: 'Workforce',
      description:
         'Intelligent workforce management, tracking, collaboration & performance platform.',
      start_url: '/',
      display: 'standalone',
      background_color: '#09090b',
      theme_color: '#18181b',
      icons: [
         {
            src: '/assets/icons/logo.png',
            sizes: '192x192',
            type: 'image/png',
         },
         {
            src: '/assets/icons/logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
         },
      ],
      categories: ['productivity', 'business', 'management'],
   };
}
