import fs, { readFileSync, writeFileSync } from 'fs'
import path, { join } from 'path'
import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
import inlineImage from 'esbuild-plugin-inline-image'
import imageminPlugin from 'esbuild-plugin-imagemin'
import { htmlPlugin } from '@craftamap/esbuild-plugin-html'

process.env.NODE_ENV = 'production'

const distPath = join(__dirname, 'dist')
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true })
} else fs.rmSync(distPath, { recursive: true, force: true })

const nodeEntryPoint = './esbuild-entries/node-entry.js'
const nodeOutputFile = './dist/bot.js'

const nodeBundle: esbuild.BuildOptions = {
  entryPoints: [nodeEntryPoint],
  platform: 'node',
  outfile: nodeOutputFile,
  bundle: true,
  minify: true,
  sourcemap: true,
  keepNames: true,
  metafile: true,
  format: 'cjs',
  external: ['esbuild'],
  loader: {
    '.js': 'jsx',
  },
  assetNames: 'assets/[name]-[hash]',
  plugins: [inlineImage(), sassPlugin()],
  target: 'ES2018',
  treeShaking: true,
}

const webchatEntryPoint = './esbuild-entries/webchat-entry.js'
const webchatOutputFile = './dist/webchat.botonic.js'

const webchatBundle: esbuild.BuildOptions = {
  entryPoints: [webchatEntryPoint],
  platform: 'browser',
  outfile: webchatOutputFile,
  bundle: true,
  minify: true,
  sourcemap: false,
  keepNames: true,
  format: 'iife',
  metafile: true,
  globalName: 'Botonic',
  external: ['esbuild'],
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
  },
  define: { global: 'window' },
  assetNames: 'assets/[name]-[hash]',
  plugins: [imageminPlugin(), inlineImage(), sassPlugin({ type: 'style' })],
  treeShaking: true,
}

const webviewsEntryPoint = './esbuild-entries/webviews-entry.js'

const BOTONIC_PATH = path.resolve(
  __dirname,
  'node_modules',
  '@botonic',
  'react',
)
const TEMPLATES = {
  WEBCHAT: 'webchat.template.html',
  WEBVIEWS: 'webview.template.html',
}
const WEBVIEW_TEMPLATE_PATH = path.resolve(
  BOTONIC_PATH,
  'src',
  TEMPLATES.WEBVIEWS,
)

const webviewsBundle: esbuild.BuildOptions = {
  entryPoints: [{ in: webviewsEntryPoint, out: 'webviews' }],
  platform: 'browser',
  outdir: './dist/webviews',
  bundle: true,
  minify: true,
  keepNames: true,
  sourcemap: true,
  format: 'iife',
  globalName: 'BotonicWebview',
  external: ['esbuild'],
  loader: {
    '.js': 'jsx',
    '.ts': 'tsx',
  },
  treeShaking: true,
  metafile: true,
  define: { global: 'window' },
  assetNames: '../assets/[name]-[hash]',
  plugins: [
    imageminPlugin(),
    inlineImage(),
    sassPlugin({ type: 'style' }),
    htmlPlugin({
      files: [
        {
          entryPoints: [webchatEntryPoint],
          filename: 'index.html',
          scriptLoading: 'defer',
          extraScripts: [
            {
              src: 'webviews.js',
              attrs: {
                defer: '',
              },
            },
          ],
          htmlTemplate: readFileSync(WEBVIEW_TEMPLATE_PATH, {
            encoding: 'utf-8',
          }),
        },
      ],
    }),
  ],
}

async function botonicBundle() {
  const nodeBundleResult = await esbuild
    .build(nodeBundle)
    .catch(() => process.exit(1))

  fs.writeFileSync(
    'meta-node-bundle.json',
    JSON.stringify(nodeBundleResult.metafile),
  )

  const webchatBundleResult = await esbuild
    .build(webchatBundle)
    .catch(() => process.exit(1))

  fs.writeFileSync(
    'meta-webchat-bundle.json',
    JSON.stringify(webchatBundleResult.metafile),
  )
  const webviewsBundleResult = await esbuild
    .build(webviewsBundle)
    .catch(() => process.exit(1))

  fs.writeFileSync(
    'meta-webviews-bundle.json',
    JSON.stringify(webviewsBundleResult.metafile),
  )
}

botonicBundle()
