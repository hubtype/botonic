import { defineConfig } from '@rslib/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { fileURLToPath } from 'node:url'

/** Build npm packages; application UMD bundles remain the responsibility of dx. */
export function packageConfig({ react = false, cli = false } = {}) {
  return defineConfig({
    plugins: react ? [pluginReact({ fastRefresh: false })] : [],
    source: {
      entry: { index: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'] },
      tsconfigPath: './tsconfig.build.json',
      // A package must read the consuming application's environment at runtime.
      define: { 'process.env.NODE_ENV': 'process.env.NODE_ENV' },
    },
    lib: [
      {
        format: 'esm',
        bundle: false,
        outBase: 'src',
        autoExtension: false,
        syntax: cli ? 'es2022' : 'es2020',
        dts: { bundle: false, abortOnError: true, autoExtension: false },
        redirect: {
          asset: { extension: false },
          style: { extension: false },
        },
      },
    ],
    output: {
      target: react ? 'web' : 'node',
      distPath: { root: cli ? 'lib/src' : 'lib/esm' },
      minify: false,
      sourceMap: { js: 'source-map' },
      autoExternal: true,
      copy: [
        {
          from: '**/*.{svg,png,scss,html,d.ts}',
          context: 'src',
          noErrorOnMissing: true,
        },
        ...(!cli
          ? [
              {
                from: fileURLToPath(
                  new URL('./module-package.json', import.meta.url)
                ),
                to: 'package.json',
              },
            ]
          : []),
      ],
    },
  })
}
