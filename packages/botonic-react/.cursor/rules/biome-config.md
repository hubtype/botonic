# Configuración de Biome para botonic-react

Este paquete usa **Biome** para linting y formateo (no ESLint/Prettier).

## Estructura de herencia

```
/biome.json (root)                    ← Reglas base del monorepo
    ↑ extends
/packages/botonic-react/biome.json    ← Reglas adicionales para React
```

## Reglas específicas de este paquete

El archivo `biome.json` local añade reglas que **solo aplican a React**:

| Categoría       | Reglas                                           | Propósito             |
| --------------- | ------------------------------------------------ | --------------------- |
| **a11y**        | `useAltText`, `noSvgWithoutTitle`, etc.          | Accesibilidad en JSX  |
| **correctness** | `useExhaustiveDependencies`, `useHookAtTopLevel` | Reglas de hooks       |
| **correctness** | `useJsxKeyInIterable`                            | Keys en listas        |
| **suspicious**  | `noArrayIndexKey`                                | Anti-pattern de React |
| **security**    | `noDangerouslySetInnerHtml`                      | XSS en React          |

## Decisiones importantes

- **Todas las reglas React están como `warn`** (no bloquean CI)
- Esto permite mejora gradual sin romper el build
- Los errores (`error`) son solo reglas auto-fixables de la config base

## Comandos

```bash
npm run lint        # Lint + fix automático
npm run lint:check  # Solo verificar (CI)
npm run format      # Solo formatear
```

## Documentación completa

Ver `/.cursor/plans/BIOME_RULES_EXPLANATION.md` para explicación detallada de cada regla.

## Cuándo modificar las reglas

1. **Añadir regla React** → Editar `/packages/botonic-react/biome.json`
2. **Añadir regla global** → Editar `/biome.json` (root)
3. **Convertir warn → error** → Solo si se han corregido todos los warnings existentes
