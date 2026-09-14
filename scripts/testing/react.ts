import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { type Plugin, transformWithEsbuild } from 'vite'

// Existing Botonic sources contain JSX in .js files, including lib dependencies.
export function reactTests(): Plugin[] {
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

export function testAssets(packageUrl: string) {
  return [
    {
      find: /^.*\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$/,
      replacement: fileURLToPath(
        new URL('./tests/__mocks__/file-mock.js', packageUrl)
      ),
    },
    {
      find: /^.*\.(css|less|scss|sass)$/,
      replacement: 'identity-obj-proxy',
    },
  ]
}
