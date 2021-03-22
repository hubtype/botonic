var child_process = require('child_process');
var npm_args = JSON.parse(process.env.npm_config_argv)["cooked"]
if (process.env.BOTONIC_NO_INSTALL_ROOT_DEPENDENCIES) {
  process.exit(0)
}
if (npm_args.includes("--save-dev")) {
  console.log("Installing common botonic development dependencies:")
  process.chdir(__dirname)
  child_process.exec('npm install -D', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      process.exit(1)
    }
    console.log(stdout);
    console.error(stderr);
    console.log("Done. Installing package dependencies:")
  });
}
