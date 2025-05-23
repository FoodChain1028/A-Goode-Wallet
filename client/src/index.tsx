import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { ThemeProvider } from './contexts/themeContext'
import { ThirdwebProvider } from 'thirdweb/react'
import { WalletProvider } from './contexts/walletContext'
import { CollapseProvider } from './contexts/collapseContext'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ThirdwebProvider>
          <CollapseProvider>
            <WalletProvider>
              <App />
            </WalletProvider>
          </CollapseProvider>
        </ThirdwebProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
