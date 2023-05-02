// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const path = require('path')

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

/** @type {import('@docusaurus/types').Config} */
const config = {
  baseUrl: '/',

  title: 'Botonic Docs',
  tagline: 'Botonic Documentation',
  url: 'https://botonic.io/',
  favicon: 'favicon.ico',
  organizationName: 'hubtype',
  projectName: 'Botonic Docs',
  scripts: ['https://buttons.github.io/buttons.js'],
  onBrokenLinks: 'warn',
  plugins: [
    async function myPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require('tailwindcss'))
          postcssOptions.plugins.push(require('autoprefixer'))
          return postcssOptions
        },
      }
    },
    path.resolve(__dirname, 'custom-webpack-config-plugin'),
  ],

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: './docs',
          routeBasePath: '/docs',
          sidebarPath: require.resolve('./sidebars.json'),
          sidebarCollapsible: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          path: './blog',
          routeBasePath: '/blog',
          showReadingTime: true,
          blogTitle: 'Botonic Blog',
          blogDescription:
            'News and technical articles about building React based Conversational Apps with Botonic',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    // /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      // Replace with your project's social card
      // image: 'img/docusaurus.png',
      algolia: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_SEARCH_API_KEY,
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
          {
            to: '/docs/releases/releases-intro',
            label: 'Releases',
            position: 'right',
          },

          { to: '/docs/faq', label: 'FAQ', position: 'right' },

          { to: '/examples', label: 'Examples', position: 'right' },
          { to: '/blog', label: 'Blog', position: 'right' },
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
                href: 'https://botonic.slack.com',
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
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    },
}

module.exports = config
