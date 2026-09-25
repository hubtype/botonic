import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'
import { defineConfig } from 'vitest/config'

function botonicSourceMapGuard() {
  return {
    name: 'botonic-test-avoid-src-sourcemaps',
    enforce: 'pre',
    load(id) {
      const cjsPath = toBotonicCjsPath(id)
      if (cjsPath) {
        return fs.readFileSync(cjsPath, 'utf-8')
      }
      return undefined
    },
    transform(_code, id) {
      const cjsPath = toBotonicCjsPath(id)
      if (cjsPath) {
        return {
          code: fs.readFileSync(cjsPath, 'utf-8'),
          map: null,
        }
      }
    },
  }
}

function toBotonicCjsPath(id) {
  if (!id.includes(`${path.sep}node_modules${path.sep}@botonic${path.sep}`)) {
    return undefined
  }
  if (!id.includes(`${path.sep}src${path.sep}`)) {
    return undefined
  }
  const cjsPath = id.replace(
    `${path.sep}src${path.sep}`,
    `${path.sep}lib${path.sep}cjs${path.sep}`
  )
  return fs.existsSync(cjsPath) ? cjsPath : undefined
}

function botonicAssetMock() {
  const mockPath = fileURLToPath(new URL('./file-mock.js', import.meta.url))
  const assetPattern =
    /\.(png|svg|jpe?g|gif|webp|woff2?|ttf|eot|otf|mp4|webm|wav|mp3|m4a|aac|oga)$/
  return {
    name: 'botonic-test-asset-mock',
    enforce: 'pre',
    resolveId(source) {
      if (assetPattern.test(source)) {
        return mockPath
      }
    },
    load(id) {
      if (assetPattern.test(id)) {
        return 'export default "test-file-stub"'
      }
    },
  }
}

function reactPlugins() {
  return [
    botonicSourceMapGuard(),
    botonicAssetMock(),
    {
      name: 'botonic-test-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (
          /\.js$/.test(id) &&
          !id.includes('/node_modules/') &&
          id.includes(`${path.sep}src${path.sep}`)
        ) {
          return transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic',
          })
        }
      },
    },
    react({
      include: ['**/*.{jsx,tsx}'],
    }),
  ]
}

export function packageTests(
  packageUrl,
  { react: useReact = false, botApp = false } = {}
) {
  const projectPath = fileURLToPath(new URL('.', packageUrl))
  const useBotonicTestStack = useReact || botApp

  return defineConfig({
    root: projectPath,
    plugins: useReact
      ? reactPlugins()
      : botApp
        ? [botonicSourceMapGuard(), botonicAssetMock()]
        : [],
    ssr: undefined,
    resolve: useBotonicTestStack
      ? {
          alias: [
            ...(botApp
              ? [
                  {
                    find: /^BotonicProject(?=\/|$)/,
                    replacement: `${projectPath}src`,
                  },
                ]
              : []),
            {
              find: /^.*\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/,
              replacement: fileURLToPath(
                new URL('./file-mock.js', import.meta.url)
              ),
            },
            {
              find: /^.*\.(css|less|scss|sass)$/,
              replacement: fileURLToPath(
                import.meta.resolve('identity-obj-proxy')
              ),
            },
          ],
        }
      : undefined,
    test: {
      globals: true,
      environment: 'node',
      isolate: true,
      server: useBotonicTestStack
        ? {
            deps: {
              inline: [/^@botonic\//],
              fallbackCJS: true,
            },
          }
        : undefined,
      include: [
        'tests/**/*.{js,jsx,ts,tsx}',
        '**/*.{test,spec}.{js,jsx,ts,tsx}',
      ],
      exclude: [
        '**/node_modules/**',
        '**/lib/**',
        '**/*.d.ts',
        'tests/helpers/**',
        '**/*.helper.js',
        'tests/__mocks__/**',
      ],
      reporters: ['default', 'junit'],
      outputFile: { junit: 'junit.xml' },
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{js,ts,jsx,tsx}'],
        exclude: ['**/*.d.ts'],
        reportsDirectory: 'coverage',
        reporter: ['text', 'lcov', 'json-summary'],
      },
    },
  })
}
