export const ENCODINGS = {
  UTF8: 'utf-8',
}

export const EXTENSIONS = {
  MARKDOWN: '.md',
  JSON: '.json',
}

export const STRUCTURE = {
  DOCS: {
    PLUGINS_SEPARATOR: 'plugins/',
    SIDEBARS: {
      PLUGINS: 'Plugins',
      PLUGIN_LIBRARY: 'Plugin Library',
    },
    i18EN: {
      LOCALIZED_STRINGS: 'localized-strings',
      DOCS: 'docs',
      PLUGIN_TITLE: 'title',
    },
  },
  PACKAGES: {
    PLUGIN_NAME_SEPARATOR: '-',
    README: 'README',
    PLUGIN_REF: 'plugin', //refers to 'plugin' in botonic-plugin-name
    BOTONIC_PLUGIN_REF: 'botonic-', //refers to 'botonic-' in botonic-plugin-name
    PLUGIN_NLU_LOWERCASE: 'nlu',
    PLUGIN_NLU_UPPERCASE: 'NLU',
  },
}

export const PACKAGES = STRUCTURE.PACKAGES
export const DOCS = STRUCTURE.DOCS
export const SIDEBARS = STRUCTURE.DOCS.SIDEBARS
export const i18EN = STRUCTURE.DOCS.i18EN
