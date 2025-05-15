import React, { ReactNode } from 'react'
import styled from 'styled-components'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'

interface LayoutProps {
  children: ReactNode
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.fg};
`

const ContentArea = styled.div`
  flex: 1;
  margin-left: 250px; /* Width of the sidebar */
  margin-top: 70px; /* Height of the navbar */
  padding: 20px;
  overflow-y: auto;
`

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Navbar />
      <Sidebar />
      <ContentArea>{children}</ContentArea>
    </LayoutContainer>
  )
}

export default Layout
