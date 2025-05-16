import { createContext, useState, useContext, ReactNode } from 'react'

interface CollapseContextType {
  collapsed: boolean
  toggleCollapse: () => void
}

const CollapseContext = createContext<CollapseContextType | undefined>(undefined)

export const CollapseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  return (
    <CollapseContext.Provider value={{ collapsed, toggleCollapse }}>
      {children}
    </CollapseContext.Provider>
  )
}

export const useCollapseContext = () => {
  const ctx = useContext(CollapseContext)
  if (!ctx) throw new Error('useCollapseContext must be used within a CollapseProvider')
  return ctx
}
