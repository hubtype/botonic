import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { transformWithEsbuild } from 'vite'
import { defineConfig } from 'vitest/config'

function reactPlugins() {
  return [
    {
      name: 'botonic-test-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (/\.js$/.test(id) && !id.includes('/node_modules/')) {
          const result = await transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic',
          })
          return result.code
        }
      },
    },
    ...react(),
  ]
}

export function packageTests(
  packageUrl,
  { react: useReact = false, botApp = false } = {}
) {
  const projectPath = fileURLToPath(new URL('.', packageUrl))
  return defineConfig({
    root: projectPath,
    plugins: useReact ? reactPlugins() : [],
    resolve: useReact
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
