import { ThemeProvider } from 'styled-components'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import './App.css'

// pages
import DashboardPage from './pages/DashboardPage'
import AssetsPage from './pages/AssetsPage'
import SwapPage from './pages/SwapPage'
import TransactionsPage from './pages/TransactionsPage'
import AddressBookPage from './pages/AddressBookPage'
import AppsPage from './pages/AppsPage'
import SettingsPage from './pages/SettingsPage'
import WhatsNewPage from './pages/WhatsNewPage'
import HelpPage from './pages/HelpPage'

// styles
import { lightTheme } from './styles/lightTheme'
import { darkTheme } from './styles/darkTheme'
import { GlobalStyle } from './styles/globalStyles'

// hooks
import { useTheme } from './hooks/useTheme'

function App() {
  const { themeMode } = useTheme()
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/swap" element={<SwapPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/address-book" element={<AddressBookPage />} />
          <Route path="/apps" element={<AppsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/whats-new" element={<WhatsNewPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  )
}

export default App
