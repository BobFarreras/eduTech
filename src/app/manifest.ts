// filepath: src/app/manifest.ts
import type { MetadataRoute } from 'next';

// IDEALMENT: Importaríem això de src/core/constants/theme.ts
const THEME_COLOR = '#ffffff';
const BACKGROUND_COLOR = '#ffffff';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'eduTech - Aprèn tecnologia jugant',
    short_name: 'eduTech',
    description: 'Plataforma d\'aprenentatge gamificada per a conceptes tecnològics.',
    start_url: '/',
    display: 'standalone',
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}