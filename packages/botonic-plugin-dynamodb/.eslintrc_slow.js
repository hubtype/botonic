const base = require('./.eslintrc');
base.parserOptions.project = "./tests/tsconfig.json";

base.rules["@typescript-eslint/no-floating-promises"] =  "error"; // see https://github.com/xjamundx/eslint-plugin-promise/issues/151
base.rules["@typescript-eslint/no-misused-promises"] = "error";
base.rules["@typescript-eslint/require-await"] = "error";

module.exports = base;
