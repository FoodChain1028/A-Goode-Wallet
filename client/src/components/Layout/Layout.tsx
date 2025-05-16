import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import { useCollapseContext } from '../../contexts/collapseContext'
interface LayoutProps {
  children: ReactNode
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.fg};
`

const ContentArea = styled.div<{ collapsed: boolean }>`
  flex: 1;
  margin-left: ${props => (props.collapsed ? '70px' : '250px')};
  margin-top: 70px; /* Height of the navbar */
  padding: 20px;
  overflow-y: auto;
  transition: margin-left 0.3s ease;
`

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { collapsed } = useCollapseContext()

  return (
    <LayoutContainer>
      <Navbar />
      <Sidebar />
      <ContentArea collapsed={collapsed}>{children}</ContentArea>
    </LayoutContainer>
  )
}

export default Layout
