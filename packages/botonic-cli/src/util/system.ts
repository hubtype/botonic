import {execSync, spawn} from 'child_process'

export async function sleep(ms: number): Promise<number> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function execCommand(command: string): string {
  return String(execSync(command)).trim()
}

export function execCommandSafe(command: string): string {
  try {
    return execCommand(command)
  } catch (e) {
    return String(e)
  }
}

export function spawnProcess(command: string, args: string[], onClose?: () => string): void {
  const childProcess = spawn(command, args, {shell: true}) // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
  childProcess.stdout.on('data', (out) => {
    process.stdout.write(out)
  })
  childProcess.stderr.on('data', (stderr) => {
    process.stderr.write(stderr)
  })
  childProcess.on('close', (code) => {
    onClose && onClose()
    process.stdout.write(`child process exited with code ${String(code)}`)
  })
}

export function spawnNpmScript(script: string, onClose?: () => string): void {
  spawnProcess('npm', ['run', script], onClose)
}
