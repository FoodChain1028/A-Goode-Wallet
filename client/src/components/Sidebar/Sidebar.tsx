import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  WalletIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
  BookOpenIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { ActionButton, AddressButton } from '../Buttons'
import { useWalletContext } from '../../contexts/walletContext'
import { MenuList, MenuItem } from './menu'
import { ProfileSection, Balance } from './profile'
import { FooterSection } from './footer'

// collapse context
import { useCollapseContext } from '../../contexts/collapseContext'

const menuItemsData = [
  { label: 'Home', icon: HomeIcon, path: '/' },
  { label: 'Assets', icon: WalletIcon, path: '/assets' },
  { label: 'Swap', icon: ArrowsRightLeftIcon, path: '/swap' },
  { label: 'Transactions', icon: ClockIcon, path: '/transactions' },
  { label: 'Address Book', icon: BookOpenIcon, path: '/address-book' },
  { label: 'Apps', icon: Squares2X2Icon, path: '/apps' },
  { label: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
]

const footerMenuItemsData = [
  { label: "What's new", icon: InformationCircleIcon, path: '/whats-new' },
  { label: 'Need help?', icon: ChatBubbleLeftRightIcon, path: '/help' },
]

const SidebarContainer = styled.div<{ collapsed: boolean }>`
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.fg};
  width: ${props => (props.collapsed ? '70px' : '230px')};
  height: 95vh;
  position: fixed;
  top: 60px; /* Height of the navbar */
  left: 0;
  bottom: 0;
  padding: 20px 0;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  svg {
    margin-right: ${props => (props.collapsed ? '0' : '10px')};
    width: 20px;
    height: 20px;
  }
`

const trimWalletAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-3)}`
}

const CollapseButton = styled.button<{ collapsed?: boolean }>`
  position: absolute !important;
  z-index: 2;
  color: ${props => props.theme.fg};
  padding: 8px 0;
  right: 0;
  transform: translateX(50%);
  margin-top: 141.5px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  border: 0;
  cursor: pointer;
  background-color: ${props => props.theme.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${props => props.theme.primary.DEFAULT};
  }

  svg {
    width: 15px;
    height: 15px;
    margin-right: 15px;
  }
`

const Sidebar: React.FC = () => {
  const location = useLocation()
  const [activePath, setActivePath] = useState(location.pathname)
  const { collapsed, toggleCollapse } = useCollapseContext()
  const { walletAddrs } = useWalletContext()

  useEffect(() => {
    setActivePath(location.pathname)
  }, [location.pathname])

  // TODO: implement copying function for contract address
  // TODO: or maybe add a popup to: (1) copy (2) show qrcode
  const handleCopyAddress = () => {
    // navigator.clipboard.writeText()
  }

  // TODO: implement new transaction function
  const handleNewTransactionClick = () => {}

  return (
    <SidebarContainer collapsed={collapsed}>
      <CollapseButton onClick={toggleCollapse} collapsed={collapsed}>
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </CollapseButton>
      {!(walletAddrs && walletAddrs.length > 0) ? (
        <>
          <ProfileSection collapsed={collapsed}>
            {!collapsed && (
              <AddressButton onClick={handleCopyAddress}>
                {trimWalletAddress('0x1234567890123456789012345678901234567890')}
              </AddressButton>
            )}
            {!collapsed && <Balance>$0</Balance>}
            {!collapsed ? (
              <ActionButton onClick={handleNewTransactionClick}>New transaction</ActionButton>
            ) : (
              <ActionButton onClick={handleNewTransactionClick}>
                <PlusIcon />
              </ActionButton>
            )}
          </ProfileSection>
          <MenuList>
            {menuItemsData.map(item => (
              <Link
                to={item.path}
                key={item.label}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <MenuItem active={activePath === item.path} collapsed={collapsed}>
                  <item.icon /> {!collapsed && item.label}
                </MenuItem>
              </Link>
            ))}
          </MenuList>
        </>
      ) : (
        <ProfileSection collapsed={collapsed}>
          {!collapsed ? (
            <ActionButton onClick={handleNewTransactionClick}>Create</ActionButton>
          ) : (
            <ActionButton onClick={handleNewTransactionClick}>
              <PlusIcon />
            </ActionButton>
          )}
        </ProfileSection>
      )}

      <FooterSection collapsed={collapsed}>
        {footerMenuItemsData.map(item => (
          <Link
            to={item.path}
            key={item.label}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <MenuItem active={activePath === item.path} collapsed={collapsed}>
              <item.icon /> {!collapsed && item.label}
            </MenuItem>
          </Link>
        ))}
      </FooterSection>
    </SidebarContainer>
  )
}

export default Sidebar
