import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export function packageTests(packageUrl: string) {
  return defineConfig({
    root: fileURLToPath(new URL('.', packageUrl)),
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
