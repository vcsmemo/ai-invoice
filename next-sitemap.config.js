/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://aiinvoicegenerators.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 1.0,
  sitemapSize: 7000,
  outDir: 'public',
  // Default transformation
  transform: async (config, path) => {
    return {
      loc: path,
      lastmod: new Date().toISOString(),
    }
  },
  // Additional paths
  additionalPaths: async (config) => {
    const result = []

    // Homepage
    result.push({
      loc: 'https://aiinvoicegenerators.com',
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 1.0,
    })

    // Profession pages (will be added as we create them)
    const professions = [
      'freelancer',
      'photographer',
      'designer',
    ]

    for (const profession of professions) {
      result.push({
        loc: `https://aiinvoicegenerators.com/p/${profession}`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
      })
    }

    return result
  },
}
