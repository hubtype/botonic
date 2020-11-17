const path = require('path')

module.exports = {
  baseUrl: '/',
  title: 'Botonic Docs',
  tagline: 'Botonic Documentation',
  url: 'https://botonic.io/',
  favicon: 'favicon.ico',
  organizationName: 'hubtype',
  projectName: 'Botonic Docs',
  scripts: ['https://buttons.github.io/buttons.js'],
  onBrokenLinks: 'warn',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '/docs',
          sidebarPath: require.resolve('./sidebars.json'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [path.resolve(__dirname, 'custom-webpack-config-plugin')],
  themeConfig: {
    algolia: {
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.INDEX_NAME,
    },
    announcementBar: {
      id: 'supportus',
      content:
        '⭐️ If you like Botonic, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/hubtype/botonic">GitHub</a>! ⭐️',
    },
    navbar: {
      title: 'Botonic',
      logo: {
        alt: 'Botonic Logo',
        src: 'img/botonic-logo.png',
        href: '/',
      },
      items: [
        { to: '/docs/welcome', label: 'User Guide', position: 'right' },
        {
          to: '/docs/concepts/actions',
          label: 'Reference Guide',
          position: 'right',
        },
        {
          to: '/docs/plugins/botonic-plugins',
          label: 'Plugins',
          position: 'right',
        },
        { to: '/docs/faq', label: 'FAQ', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'About Us',
          items: [
            {
              label: 'Hubtype',
              href: 'https://www.hubtype.com/',
            },
            {
              label: 'Botonic',
              href: 'https://botonic.io/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Botonic Slack',
              href: 'https://slack.botonic.io/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/hubtype/botonic',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hubtype. Built with Docusaurus.`,
    },
    image: 'img/docusaurus.png',
    sidebarCollapsible: true,
  },
}
