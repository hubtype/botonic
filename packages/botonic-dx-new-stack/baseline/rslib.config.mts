import { pluginReact } from '@rsbuild/plugin-react'
import { defineConfig } from '@rslib/core'

export function packageConfig({ react = false }: { react?: boolean } = {}) {
  return defineConfig({
    plugins: react ? [pluginReact({ fastRefresh: false })] : [],
    source: {
      entry: { index: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'] },
      tsconfigPath: './tsconfig.build.json',
      define: { 'process.env.NODE_ENV': 'process.env.NODE_ENV' },
    },
    lib: [
      {
        format: 'esm',
        bundle: false,
        outBase: 'src',
        autoExtension: false,
        syntax: 'es2020',
        dts: { bundle: false, abortOnError: true, autoExtension: false },
        redirect: {
          asset: { extension: false },
          style: { extension: false },
        },
      },
    ],
    output: {
      target: react ? 'web' : 'node',
      distPath: { root: 'lib' },
      cleanDistPath: true,
      minify: false,
      sourceMap: { js: 'source-map' },
      autoExternal: true,
      copy: [
        {
          from: '**/*.{svg,png,scss,html,d.ts}',
          context: 'src',
          noErrorOnMissing: true,
        },
      ],
    },
  })
}
