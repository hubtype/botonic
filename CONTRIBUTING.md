# Contributing to Botonic

🙌:tada: First of all, thanks for using Botonic 🤖and taking your time to contribute! :tada:🙌

The following is a set of guidelines for contributing to Botonic and its packages, which are hosted in [Hubtype's Botonic](https://github.com/hubtype/botonic) project on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request. To know more about the company behind Botonic, please refer to [https://www.hubtype.com/](https://www.hubtype.com/).

## Code of Conduct
This project and everyone participating in it is governed by the [Botonic Code of Conduct](https://github.com/hubtype/botonic/blob/master/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [developers@hubtype.com](mailto:developers@hubtype.com).

## I just have questions, suggestions...
If you have any suggestions or just want to let us know what you think of Botonic, feel free to contact us on [Slack](https://slack.botonic.io/)!

## What about Botonic?
<p align="center">
  <a  href="https://botonic.io/">
    <img alt="Node.js" src="https://botonic.io/img/botonic-logo.png" width="150"/>
  </a>
</p>

[Botonic](https://botonic.io) is the open source framework developed by [Hubtype](https://www.hubtype.com) for building amazing Chatbots for any Platform with React. [Botonic](https://botonic.io) is an easy to learn, open-source framework that lets you create powerful conversational interfaces that work on the most popular messaging apps (Whatsapp, Facebook Messenger, Telegram and more), your website or even your native mobile apps (Android/iOS). 

### Project Structure
Botonic is structured as a monorepo as this allows us to have a simplified organization in modules. Here's a quick explanation:
* [botonic/packages](https://github.com/hubtype/botonic/tree/master/packages) - Here live all packages that allow Botonic to work in harmony. The convention for the packages is `botonic-[botonic--main-package-name]` for the main packages and `botonic-plugin-[botonic-plugin-name]` for plugins.
	* [botonic-cli](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli): here resides the code of the CLI interface that allows you to create, build and deploy your projects.
	* [botonic-core](https://github.com/hubtype/botonic/tree/master/packages/botonic-core): the conducting package of Botonic, responsible of interpreting the bot flows, processing the inputs, dealing with the plugins... summarizing, all the internal logic.
	* [botonic-react](https://github.com/hubtype/botonic/tree/master/packages/botonic-react): this allows you to build your chatbots with React, all the [components](https://docs.botonic.io/components/components) and [Webchat's logic](https://docs.botonic.io/concepts/webchat) can be found here.
	* [botonic-nlu](https://github.com/hubtype/botonic/tree/master/packages/botonic-nlu): an extension to provide Natural Language Understanding (NLU) to work alongside `botonic-cli`.
	* ...and a rich ecosystem of [plugins](https://docs.botonic.io/plugins/using-plugins) that allows you to extend Botonic's functionalities!
* [botonic/docs](https://github.com/hubtype/botonic/tree/master/docs) - Here is where we document the project. To do so, we use [docz](https://www.docz.site/). You can find the documentation for this project at [docs.botonic.io](https://docs.botonic.io/).


## How Can I Contribute?

### Reporting Bugs
Before creating bug reports, please check the [botonic issues](https://github.com/hubtype/botonic/issues) as you might find out that you don't need to create one. When you are creating a bug report, please fill out the [template](https://github.com/hubtype/botonic/blob/master/.github/ISSUE_TEMPLATE/bug_report.md), the information it asks for helps us resolve issues faster. Please, describe the problem and include additional details to help maintainers reproduce the problem as well as possible.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

### Suggesting Enhancements
Before creating enhancement suggestions, please check the [botonic pull requests](https://github.com/hubtype/botonic/pulls) as maybe somebody is working on it. When you are creating an enhancement suggestion, please include as many details as possible by filling the [template](https://github.com/hubtype/botonic/blob/master/.github/ISSUE_TEMPLATE/feature_request.md), including the steps that you imagine you would take if the feature you're requesting existed.

### Creating your plugins
If you want to extend Botonic's functionalities you are free to create your own plugins as described in the following [guideline](https://docs.botonic.io/plugins/botonic-plugins).

## Styleguides

### Git Commit Messages
For the sake of clarity and organization, we follow [this guideline](https://hackwild.com/article/semantic-git-commits/) in order to commit our changes.
-   `feat:`  - implement new features for endusers
-   `fix:`  - bug fix for endusers (not a build-process fix)
-   `docs:`  - update to project documentation
-   `style:`  - update code formatting (indentation, tabs vs spaces, etc.)
-   `refactor:`  - refactoring of code
-   `test:`  - adding or updating tests
-   `chore:`  - updates to build process

### JavaScript / TypeScript Styleguide

All [JavaScript](https://www.scaler.com/topics/javascript/) must adhere to [JavaScript Standard Style](https://standardjs.com/).
* The code for our packages is mainly written in [JavaScript's ES6 syntax](https://www.w3schools.com/js/js_es6.asp), but some others are written as well with [TypeScript](https://www.typescriptlang.org/), as for example the [CLI](https://github.com/hubtype/botonic/tree/master/packages/botonic-cli) or [botonic-plugin-contentful](https://github.com/hubtype/botonic/tree/master/packages/botonic-plugin-contentful), so feel free to contribute with what make you feel more comfortable.
* We format all of our code with [editorconfig](http://editorconfig.org/) and [Prettier](https://prettier.io/). The configurations are the following:
#### [.editorconfig](https://github.com/hubtype/botonic/blob/master/.editorconfig)
```javascript
root = true

[*]

indent_style = space

indent_size = 2

charset = utf-8

trim_trailing_whitespace = true

insert_final_newline = true

quote_type = single

ij_typescript_use_double_quotes = false

[*.md]

trim_trailing_whitespace = false
```

#### [.prettierrc](https://github.com/hubtype/botonic/blob/master/.prettierrc)
```javascript
{

"bracketSpacing": true,

"endOfLine": "lf",

"singleQuote": true,

"jsxSingleQuote": true,

"semi": false,

"tabWidth": 2,

"trailingComma": "es5"

}
```

Please, be sure you have all the code formatted in with these parameters before submitting your code.


