import { createContext, useState, useEffect, useContext, ReactNode } from 'react'

export type Uuid = string

interface WalletContextType {
  walletAddrs: string[] | null
  setWalletAddrs: (address: string[]) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddrs, setWalletAddrs] = useState<string[] | null>(() => {
    const storedAddress = localStorage.getItem('accounts') || '[]'
    const accounts = JSON.parse(storedAddress)
    return accounts
  })

  useEffect(() => {
    localStorage.setItem('accounts', JSON.stringify(walletAddrs))
  }, [walletAddrs])

  return (
    <WalletContext.Provider value={{ walletAddrs, setWalletAddrs }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWalletContext = () => {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWalletContext must be used within a WalletProvider')
  return ctx
}
