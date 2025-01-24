# Botonic bundler Rspack

## What Does This Package Do?

This package simplifies the configuration of a rspack bundler to build a Botonic project.

## IMPORTANT

- Webviews imported inside the webviews/index.ts must be classes or functions but cannot be arrow functions.

Do:

```typescript
export function MyWebview() {}
```

instead of:

```typescript
export const MyWebview = () => {}
```

## Setup

- Install this package.

```
npm install -D @botonic/dx-bundler-rspack
```

- Copy `baseline/rspack.config.js` file to the root of your project.

- Add this script to your package.json to build for production and start for development in local.

```json
"scipts": {
  "build_production": "ENVIRONMENT=production NODE_ENV=production rspack build --env target=all --mode=production",
  "start": "ENVIRONMENT=local NODE_ENV=development rspack serve --env target=dev --mode=development",
}

```
