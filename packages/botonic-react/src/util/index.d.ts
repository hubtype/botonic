import { ReactElement, ReactNode } from 'react'

export function staticAsset(path: string): string
export function hasComplexChildren(
  element: ReactNode
): ReactElement<{ children: ReactNode[] }>

export const isDev: boolean
export const isProd: boolean
