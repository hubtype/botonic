import { execSync, spawn } from 'child_process'
import { arch, platform } from 'os'
import { join } from 'path'

import { readJSON } from './file-system'

export async function sleep(ms: number): Promise<number> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function execCommand(command: string): string {
  try {
    return String(execSync(command)).trim()
  } catch (e) {
    return String(e)
  }
}

export function spawnProcess(
  command: string,
  args: string[],
  onClose?: () => string
): void {
  const childProcess = spawn(command, args, { shell: true }) // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
  childProcess.stdout.on('data', out => {
    process.stdout.write(out)
  })
  childProcess.stderr.on('data', stderr => {
    process.stderr.write(stderr)
  })
  childProcess.on('close', code => {
    onClose && onClose()
    process.stdout.write(`child process exited with code ${code}`)
  })
}

export function spawnNpmScript(script: string, onClose?: () => string): void {
  spawnProcess('npm', ['run', script], onClose)
}

export function isWindows(): boolean {
  return platform() === 'win32'
}

export function getBotonicCLIVersion(): string {
  try {
    return (readJSON(join(__dirname, '..', '..', 'package.json')) as any)
      .version
  } catch (e) {
    return String(e)
  }
}

export function getBotonicDependencies(): any[] | string {
  try {
    const packageJSON = readJSON('package.json')
    const botonicDependencies = Object.entries(
      (packageJSON as any).dependencies
    ).filter(([k, _]) => k.includes('@botonic'))
    return botonicDependencies
  } catch (e) {
    return String(e)
  }
}

export function getSystemInformation(): any {
  return {
    platform: platform(),
    arch: arch(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
    is_tty: Boolean(process.stdout.isTTY),
    framework_path: join(__dirname, '..'),
    system_path: isWindows()
      ? execCommand('echo %PATH%')
      : execCommand('echo $PATH'),
    node_version: execCommand('node --version'),
    botonic_cli_version: getBotonicCLIVersion(),
    botonic_dependencies: getBotonicDependencies(),
  }
}
