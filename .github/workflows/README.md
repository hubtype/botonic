# Reusable workflow in Botonic CI

`botonic-common-workflow.yml` is a reusable workflow that simplifies the complexity of creating future CI.
Advantatges of having a reusable workflow:

- Having every step in a single workflows simplifies the version updates, from multiple files to a single file.
- Customize the inputs to make the workflow more dynamic and especific to the needs.
- Easy to understand syntax for future workflows.

## How to write a new workflow

If you want to add an extra workflow follow the steps:

1. Check what this workflow needs:
   - Does it have tests?
   - Does it need to be uploaded to Codecov?
   - Does it need to have AWS credentials?
   - Does it need to have the tests published?

- Every point in here will be needed to know which input to add later.

2. Manage the inputs by following the names and types:

   - `NODE_VERSION`: In which version of node will the workflow run? (By default it is set to 14, if any package need it higher or lower, can be changed).
   - `PACKAGE_NAME`: The name of the Botonic package, this is just visual, does not affect the functionallity of the workflow. **This input is always necessary.**
   - `PACKAGE`: Path to the package inside Botonic root (the relative path of the package). **This input is always necessary.**
     From this point, each command is **OPTIONAL**
   - `UNIT_TEST_COMMAND`: Command to execute unit tests (usually) using npm. This has a default value of `npm run test`, but if the package does not contain any test whatsoever, use the input by adding `''` as the parameter. Also useful when needing a different test command.
   - `BUILD_COMMAND`: Command to execute the build action of the package inside CI, the main idea is that some packages have different build command. By default the command is set as `npm run build`.
   - `PUBLISH_TESTS_RESULTS`: As the name indicates, this input functions as a flag to know whether if it need to publish the results or not. Usually this flag does not need any special string, by adding a simple `'yes'` is enough, **if it is not needed, just do not add it**.
     _The rest of inputs from now on, will work similar as `PUBLISH_TESTS_RESULTS` due to being optional flags_.
   - `NEEDS_AWS_CRED`: some packages need AWS credentials to perform some steps inside the workflow, this flag enables the AWS credential generation (or verification).
   - `NEEDS_CODECOV_UPLOAD`: Flag to determinate if the workflow will upload the tests to Codecov or will ignore it.

3. Write the workflow:
   To write the workflow, we know what each input does, now it is a matter of structure:

   1. First you will add the following at the beginning of the file:

   ```YAML
   name: <package name> tests

   on:
     push:
       paths:
       - '*'
       - 'packages/*'
       - 'packages/<package-name>/**'
       - '.github/workflows/<name-of-this-file>.yml'
   workflow_dispatch:

   [...]
   ```

   > :warning: Be mindful of the identations, if you have an extra identation or a missing identation, the workflow will **fail**.

   - Some important notes regarding the keywords in the snippet above:
     - `on`: determines when the workflow will run.
     - `workflow_dispatch`: enables the execution of the workflow directly from _Github User Interface_.
     - `push`: The workflow will run when changes are pushed.
     - `paths`: The _Regex_ paths will check for changes to run the workflow.

   2. Write the necessary inputs to run the workflow:

   ```yaml
   [...]

   jobs:
     <package-name>-tests:
       uses: ./.github/workflows/botonic-common-workflow.yml
       secrets: inherit
       with:
         NODE_VERSION: '16' #or 12 if you want a below version
         PACKAGE_NAME: <package name> tests
         PACKAGE: <package-name> #Relative to the Packages folder not the root folder.
         #The following inputs are not mandatory, but may be necessary depending on your needs
         UNIT_TEST_COMMAND: npm run test_ci #or just add '' if there is not tests in the package.
         PUBLISH_TESTS_RESULTS: 'yes' #or just any string you want, p.e. 'y'
         NEEDS_CODECOV_UPLOAD: 'yes'
         #If any input extra is needed, add it below...
   ```

   > :warning: Remember to check which inputs you need. Check and double-check every input to ensure the workflow correct functionality.

   - Some description to the keywords above:
   - `jobs`: Which actions will the workflow perform.
   - `secrets`: if the workflow needs secrets, it will inherit from the ones in the home repository of **THIS** file.
   - `with`: The required inputs to run the workflow.
   - `uses`: Which workflow with use to run the steps. The input can be a path inside the same repository, a reference to an online workflow or a reference to another repository **INSIDE** your organization. An example would be the following: `organization/repository/.github/workflows/workflow-to-use.yml@branch-to-fetch-from`.

##Template to use

```YAML
name: <package name> tests

   on:
     push:
       paths:
       - '*'
       - 'packages/*'
       - 'packages/<package-name>/**'
       - '.github/workflows/<name-of-this-file>.yml'
   workflow_dispatch:

jobs:
  <package-name>-tests:
    uses: ./.github/workflows/botonic-common-workflow.yml
    secrets: inherit
    with:
      NODE_VERSION: '16' #or 12 if you want a below version
      PACKAGE_NAME: <package name> tests
      PACKAGE: <package-name> #Relative to the Packages folder not the root folder.
      #The following inputs are not mandatory, but may be necessary depending on your needs
      # UNIT_TEST_COMMAND: npm run test_ci
      # PUBLISH_TESTS_RESULTS: 'yes'
      # NEEDS_CODECOV_UPLOAD: 'yes'
      #If any input extra is needed, add it below..
```

> :information_source: Swap `<package-name>` with the package name
