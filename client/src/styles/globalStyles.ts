import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Nunito', sans-serif;
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.bg};
    color: ${props => props.theme.fg};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit; /* Or 'Nunito', sans-serif */
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
`
