# Component displayName Convention

## Context

When JavaScript code is minified for production (using rspack.SwcJsMinimizerRspackPlugin), arrow function names are lost even with `keep_fnames: true` in the bundler configuration. This is because `keep_fnames` only preserves explicit function names (from `function declarations`), not implicit names inferred from variable assignments.

```javascript
// Arrow function - name is INFERRED from variable (lost after minification)
export const Button = (props) => { ... }
// Button.name === "" after minification ❌

// Function declaration - name is EXPLICIT (preserved with keep_fnames)
export function Button(props) { ... }
// Button.name === "Button" after minification ✅
```

Since `@botonic/react` uses arrow functions for components, we must explicitly set `displayName` to ensure component identification works correctly in production.

## Rule

When creating or modifying React components in `@botonic/react` that need to be identified by type (used in `multichannel-utils.js`), you MUST:

1. Add the component name to `COMPONENT_DISPLAY_NAMES` in `src/components/constants.ts`
2. Import `COMPONENT_DISPLAY_NAMES` in the component file
3. Set `ComponentName.displayName = COMPONENT_DISPLAY_NAMES.ComponentName` after the component definition

## Example

### Step 1: Add to constants.ts

```typescript
// src/components/constants.ts
export const COMPONENT_DISPLAY_NAMES = {
  Button: 'Button',
  Text: 'Text',
  // Add new component here:
  NewComponent: 'NewComponent',
} as const
```

### Step 2: Set displayName in component file

```typescript
// src/components/new-component.tsx
import React from 'react'
import { COMPONENT_DISPLAY_NAMES } from './constants'

export const NewComponent = (props: NewComponentProps) => {
  // component implementation
}

NewComponent.displayName = COMPONENT_DISPLAY_NAMES.NewComponent
```

## Components that require displayName

The following components are used in `multichannel-utils.js` for type checking and MUST have `displayName`:

- `Button`
- `Carousel`
- `Pic`
- `Reply`
- `Subtitle`
- `Text`
- `Title`
- `MultichannelButton`
- `MultichannelReply`

## Why not use function declarations?

While function declarations would work better with `keep_fnames`, the codebase consistently uses arrow functions. The `displayName` approach:

- Is more robust (works regardless of bundler configuration)
- Maintains codebase consistency
- Is the standard React pattern for this problem
- Works with React DevTools for debugging

## Related files

- `src/components/constants.ts` - Contains `COMPONENT_DISPLAY_NAMES`
- `src/components/multichannel/multichannel-utils.js` - Uses `displayName` for component type checking
