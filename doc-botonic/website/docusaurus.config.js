module.exports = {
  baseUrl: '/',
  title: 'Botonic Docs',
  tagline: 'Botonic Documentation',
  url: 'https://botonic.io/',
  favicon: 'img/botonic-logo.png',
  organizationName: 'hubtype',
  projectName: 'Botonic Docs',
  scripts: ['https://buttons.github.io/buttons.js'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '',
          sidebarPath: require.resolve('./sidebars.json'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    defaultDarkMode: false,
    algolia: {
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: process.env.INDEX_NAME,
    },
    navbar: {
      title: 'Botonic',
      logo: {
        alt: 'Botonic Logo',
        src: 'img/botonic-logo.png',
        href: 'https://botonic.io',
      },
      links: [
        { to: 'welcome', label: 'User Guide', position: 'right' },
        { to: 'concepts/actions', label: 'Reference Guide', position: 'right' },
        { to: 'plugins/botonic-plugins', label: 'Plugins', position: 'right' },
        { to: 'faq', label: 'FAQ', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {},
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
        {},
        {},
        {},
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
        {},
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hubtype. Built with Docusaurus.`,
    },
    image: 'img/docusaurus.png',
    sidebarCollapsible: true,
  },
}
