// script call by prepare package.json scripts to upgrade dev dependencies
// when "npm i -D" executed on a package
if (process.env.BOTONIC_NO_INSTALL_ROOT_DEPENDENCIES) {
  process.exit(0)
}

function isSaveDev() {
  if (process.env.npm_config_argv) {
    // npm <7
    var npm_args = JSON.parse(process.env.npm_config_argv)['cooked']
    return npm_args.includes('--save-dev')
  }
  return process.env.npm_config_save_dev
}

if (isSaveDev()) {
  var child_process = require('child_process')
  console.log('Installing common botonic development dependencies:')
  process.chdir(__dirname)
  child_process.exec('npm install -D', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`)
      process.exit(1)
    }
    console.log(stdout)
    console.error(stderr)
    console.log('Done. Installing package dependencies:')
  })
}
