/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.sonkestudio.co.za',
  generateRobotsTxt: false,
  generateIndexSitemap: true,
  exclude: ['/api/*', '/account', '/onboarding', '/sign-in/*', '/sign-up/*'],
}
