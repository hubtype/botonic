# @botonic/dx-new-stack

Configuración compartida para crear librerías TypeScript y React con Rslib,
Vitest y Biome, siguiendo la configuración actual de las librerías de Botonic.
Este paquete está pensado para librerías externas al monorepo. No reemplaza a
`@botonic/dx`, que sigue ofreciendo la configuración de aplicaciones existente.

## Empezar

Requiere Node >=22.19 y npm >=10. Instala el paquete como dependencia de
desarrollo:

```sh
npm install --save-dev @botonic/dx-new-stack
```

Copia el contenido de `sample-config/ts-library` o
`sample-config/react-library` desde el paquete instalado a la raíz de la nueva
librería. Combina los campos de `package.json` del ejemplo con los de tu
proyecto: cambia nombre, versión, dependencias y metadatos de publicación.
Ambos ejemplos son privados para evitar publicar una plantilla por accidente;
elimina `"private": true` cuando quieras publicar tu librería.

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
`node_modules/`. Biome lee ese archivo para excluir salidas generadas.

## Qué hace cada archivo

| Archivo | Propósito y uso en la librería |
| --- | --- |
| `tsconfig.json` | Extiende `baseline/tsconfig.json`: opciones comunes de TypeScript, ESM y comprobación sin emisión. Declara el `include` de las fuentes locales y, en React, `jsx` y `allowJs`. |
| `tsconfig.build.json` | Combina `tsconfig.json` con `baseline/tsconfig.build.json`: activa las declaraciones y la emisión. Define `rootDir` y `outDir` en la librería, para que apunten a sus propios `src/` y `lib/`. |
| `tsconfig.tests.json` | Combina `tsconfig.json` con `baseline/tsconfig.tests.json`: añade los tipos de Vitest y comprueba fuentes y pruebas sin emitir archivos. El ejemplo React añade los tipos DOM. |
| `tests/tsconfig.json` | Extiende el `tsconfig.tests.json` local. Permite que el editor asocie los archivos de `tests/` con el proyecto TypeScript de pruebas. |
| `rslib.config.mts` | Importa `packageConfig()` de `baseline/rslib.config`. Produce ESM sin agrupar en `lib/`, con declaraciones y mapas de fuente; `{ react: true }` activa el plugin de React y el destino web. |
| `vitest.config.ts` | Importa `packageTests(import.meta.url)` de `baseline/vitest.config`. Fija la raíz en la librería consumidora y configura aislamiento, reportes JUnit y cobertura V8. `{ react: true }` añade el plugin React y alias para recursos. |
| `biome.json` | Vive en la raíz de cada librería y extiende `@botonic/dx-new-stack/biome`. Comparte formato, lint e importaciones ordenadas; permite añadir ajustes propios en el mismo archivo. |

La subruta pública de Vitest carga `baseline/vitest.config.mjs` y expone tipos
mediante `baseline/vitest.config.d.mts`. También se incluye
`baseline/vitest.config.ts` como referencia TypeScript: Node 22 no permite
importar directamente un `.ts` desde `node_modules` durante el arranque de
Vitest.

Este paquete de configuración no tiene tests propios. Los scripts de pruebas
de `sample-config/` pertenecen a las futuras librerías consumidoras.

Los archivos de `baseline/` son los valores compartidos. Los archivos de
`sample-config/` son los adaptadores que se copian a cada librería. Las
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
