import 'styled-components'

// This file extends the DefaultTheme interface from styled-components
// so TypeScript knows what properties are available in the theme
declare module 'styled-components' {
  export interface DefaultTheme {
    bg: string
    fg: string
    font: string
    shadow: string
    primary: {
      DEFAULT: string
      hover: string
      active: string
      muted: string
    }
    danger: {
      DEFAULT: string
      hover: string
      active: string
      muted: string
    }
    success: {
      DEFAULT: string
      hover: string
      active: string
      muted: string
    }
  }
}
