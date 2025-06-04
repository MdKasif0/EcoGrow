import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eco-grow.netlify.app'
  
  // Define your main routes
  const routes = [
    '',
    '/calendar',
    '/journal',
    '/timeline',
    '/search',
    '/chat',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
} 