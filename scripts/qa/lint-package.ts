import * as child_process from 'child_process'

if (process.env.GITHUB_ACTIONS === 'true') {
  console.log('Will skip lint as it will run in separate workflow')
  process.exit()
} else {
  console.log(`Will run linters for package ${process.argv[2]}`)
}

const packageDir = process.argv[2]

try {
  process.chdir(packageDir)
} catch (error) {
  console.error(`Failed to change directory: ${error}`)
  process.exit(1)
}

const lintProcess = child_process.spawnSync('npm', ['run', 'lint'])

if (lintProcess.error) {
  console.error(`Failed to execute lint command: ${lintProcess.error}`)
  process.exit(1)
}

const lintExitCode = lintProcess.status ?? 0

if (lintExitCode) {
  child_process.execSync('git status', { stdio: 'inherit' })
  console.log(
    'If lint fixed some files, run the following to verify the changes and commit again:'
  )
  console.log(' git diff')
  console.log(' git commit -a')
} else {
  process.exit(lintExitCode)
}
