'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

type ThemeProviderWithChildrenProps = ThemeProviderProps & {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ThemeProviderWithChildrenProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
