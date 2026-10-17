import { MetadataRoute } from 'next'
import { allDocsPages, allBlogPosts, allTutorials } from 'contentlayer/generated'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://apalis.dev'

  const docsUrls: MetadataRoute.Sitemap = allDocsPages.map((doc) => ({
    url: `${baseUrl}${doc.urlPath}`,
    lastModified: doc.lastEdited ? new Date(doc.lastEdited) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const blogUrls: MetadataRoute.Sitemap = allBlogPosts.map((post) => ({
    url: `${baseUrl}${post.urlPath}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const tutorialUrls: MetadataRoute.Sitemap = allTutorials.map((tutorial) => ({
    url: `${baseUrl}${tutorial.urlPath}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.65,
  }))

  // Static pages
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tutorials`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  return [...staticUrls, ...docsUrls, ...blogUrls, ...tutorialUrls]
}
