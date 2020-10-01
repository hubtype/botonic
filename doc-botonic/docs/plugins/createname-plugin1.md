---
id: createname-plugin1
title: Prepare the Plugin
---

## Naming

Every plugin you create for botonic has to be under a directory named:  
**`botonic-plugin-{MY_PLUGIN_NAME}`**.

- **Example:** `botonic-plugin-dialogflow`

In addition, the plugin directory has to be structured in the following way:

```
botonic-plugin-{my-plugin-name}
└── package.json
└── src
    └── index.js <-- This is the entry point of your code
    └── MY_USEFUL_CODE
```

The required fields in your **package.json** must be the following:

- **name**: we suggest you to put the same name as the directory, for simplicity and maintainability.
- **version**: plugin's version, starting by **0.0.1**.
- **main**: entry point of your plugin. We suggest that you mantain the structure as it is.
- **dependencies**: your dependencies, if any.
- **devDependencies**: your devDependencies, if any.

**Example** :

```
{
  "name": "@botonic/plugin-luis",
  "version": "0.1.0",
  "main": "src/index.js",
  "dependencies": {
    "axios": "latest"
  },
  "devDependencies": {
    "@babel/runtime": "^7.5.5"
  }
}
```
