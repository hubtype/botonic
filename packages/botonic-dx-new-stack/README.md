# @botonic/dx-new-stack

Configuración compartida para crear librerías TypeScript y React con Rslib y
aplicaciones Botonic con Rspack. Los tres ejemplos utilizan Vitest y Biome.
Este paquete está pensado para proyectos externos al monorepo. `@botonic/dx`
sigue disponible para las aplicaciones existentes.

## Empezar

Requiere Node >=22.19 y npm >=10. Instala el paquete como dependencia de
desarrollo:

```sh
npm install --save-dev @botonic/dx-new-stack
```

Copia el contenido de `sample-config/ts-library`,
`sample-config/react-library` o `sample-config/bot-app` desde el paquete
instalado a la raíz del proyecto. Combina los campos de `package.json` del
ejemplo con los de tu proyecto: cambia nombre, versión y dependencias. Los
ejemplos son privados para evitar publicarlos por accidente; elimina
`"private": true` cuando quieras publicar una librería.

```sh
npm run build
npm run typecheck
npm test
npm run lint:check
```

Las dependencias de React y sus tipos se declaran en el ejemplo React. Ajusta
las versiones admitidas por `peerDependencies` a la compatibilidad real de tu
librería. Los scripts `build` y `test` generan `lib/`, `coverage/` y
`junit.xml`; añádelos al `.gitignore` de tu proyecto junto con
`node_modules/`. Biome lee ese archivo para excluir salidas generadas. El
ejemplo `bot-app` trae `gitignore.txt`: renómbralo a `.gitignore` después
de copiar la plantilla. npm no incluye archivos `.gitignore` en el tarball.

## Aplicaciones Botonic

`sample-config/bot-app` configura Rspack `^1.6.1`, Vitest y Biome. Su
`rspack.config.ts` importa `botAppConfig()` y resuelve las rutas desde la raíz
del bot. `npm run build` genera cuatro bundles para deploy:

| Entrada del bot | Salida |
| --- | --- |
| `rspack-entries/node-entry.ts` | `dist/bot.js` |
| `rspack-entries/bot-config-entry.ts` | `dist/bot-config.js` |
| `rspack-entries/webchat-entry.ts` | `dist/webchat.botonic.js` |
| `rspack-entries/webviews-entry.ts` | `dist/webviews/webviews.js` |

El bot debe aportar estas entradas y `src/bot-config.ts`; por ejemplo, la
entrada de configuración puede exportar `botConfig` desde
`../src/bot-config`. El CLI lee `dist/bot-config.js` durante el deploy. Para el
servidor local, añade también `rspack-entries/dev-entry.ts` y ejecuta
`npm start`. Las entradas son código de cada bot y no se incluyen en la
plantilla. Ajusta las dependencias `@botonic/*` y de terceros del
`package.json` a las que realmente use tu bot.

Antes de desplegar, ejecuta `npm run typecheck`, `npm test` y
`npm run lint:check`. Las pruebas usan entorno Node por defecto; para pruebas
de interfaz, declara `// @vitest-environment jsdom` en el archivo de prueba.
La plantilla no usa `"type": "module"` porque las salidas UMD `.js` deben
poder cargarse como espera el CLI.

## Qué hace cada archivo

| Archivo | Propósito y uso en la librería |
| --- | --- |
| `tsconfig.json` | Extiende `baseline/tsconfig.json`: opciones comunes de TypeScript, ESM y comprobación sin emisión. Declara el `include` de las fuentes locales y, en React, `jsx` y `allowJs`. |
| `tsconfig.build.json` | Combina `tsconfig.json` con `baseline/tsconfig.build.json`: activa las declaraciones y la emisión. Define `rootDir` y `outDir` en la librería, para que apunten a sus propios `src/` y `lib/`. |
| `tsconfig.tests.json` | Combina `tsconfig.json` con `baseline/tsconfig.tests.json`: añade los tipos de Vitest y comprueba fuentes y pruebas sin emitir archivos. El ejemplo React añade los tipos DOM. |
| `tests/tsconfig.json` | Extiende el `tsconfig.tests.json` local. Permite que el editor asocie los archivos de `tests/` con el proyecto TypeScript de pruebas. |
| `rslib.config.mts` | Importa `packageConfig()` de `baseline/rslib.config`. Produce ESM sin agrupar en `lib/`, con declaraciones y mapas de fuente; `{ react: true }` activa el plugin de React y el destino web. |
| `rspack.config.ts` | En `bot-app`, importa `botAppConfig()` de `baseline/rspack.config` para compilar los cuatro bundles y servir la aplicación local. |
| `vitest.config.ts` | Importa `packageTests(import.meta.url)` de `baseline/vitest.config`. Fija la raíz en el proyecto consumidor y configura aislamiento, reportes JUnit y cobertura V8. `{ react: true }` añade el plugin React y alias para recursos; `{ botApp: true }` añade el alias `BotonicProject`. |
| `biome.json` | Vive en la raíz de cada proyecto y extiende `@botonic/dx-new-stack/biome`. Comparte formato, lint e importaciones ordenadas; permite añadir ajustes propios en el mismo archivo. |

Las subrutas públicas de Rspack y Vitest cargan sus archivos `.mjs` y exponen
tipos mediante archivos `.d.mts`. También se incluye
`baseline/vitest.config.ts` como referencia TypeScript: Node 22 no permite
importar directamente un `.ts` desde `node_modules` durante el arranque de
Vitest.

Este paquete de configuración no tiene tests propios. Los scripts de pruebas
de `sample-config/` pertenecen a las futuras librerías consumidoras.

Los archivos de `baseline/` son los valores compartidos. Los archivos de
`sample-config/` son los adaptadores que se copian a cada proyecto. Las
configuraciones de compilación y pruebas de TypeScript usan un array `extends`
para conservar tanto las opciones locales como las compartidas. No coloques
`include`, `rootDir`, `outDir` ni rutas de pruebas en `baseline/`: TypeScript
las interpretaría desde el paquete de configuración.

Vitest utiliza `node` por defecto, como las librerías del monorepo. En una
prueba que necesite DOM, añade al principio del archivo:

```ts
// @vitest-environment jsdom
```

Para personalizar Rslib o Vitest, conserva la llamada a `packageConfig()` o
`packageTests()` y extiende la configuración devuelta en el archivo local. Por
ejemplo, Vitest permite `mergeConfig` desde `vitest/config`. La compilación
conserva `process.env.NODE_ENV` como lectura en tiempo de ejecución y copia
recursos habituales de `src/` a `lib/`.

## Adopción futura en el monorepo

Hoy los paquetes del monorepo importan sus utilidades de `scripts/build/` y
`scripts/testing/`, y usan el `biome.json` de la raíz. Se podría reducir esa
duplicación migrando primero una librería pequeña a las exportaciones de este
paquete y comprobando las rutas TypeScript, las salidas de Rslib y los reportes
de Vitest. Después se podrían migrar las demás por separado. Esta versión no
cambia ningún consumidor interno ni introduce una variante para la CLI, que
tiene opciones propias de NodeNext y pruebas de comandos.
