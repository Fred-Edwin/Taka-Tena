import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://takatena.co.ke'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/profile/',
        '/listings/*/edit',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}