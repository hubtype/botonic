import { rmSync } from 'node:fs'

// npm workspace scripts run with the package directory as cwd.
rmSync('lib', { recursive: true, force: true })
