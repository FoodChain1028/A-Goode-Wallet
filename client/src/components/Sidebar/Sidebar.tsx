import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CircleStackIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  BookOpenIcon,
  Squares2X2Icon,
  Cog6ToothIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { ActionButton, AddressButton } from '../Buttons';

const menuItemsData = [
  { label: 'Home', icon: HomeIcon, path: '/' },
  { label: 'Assets', icon: CircleStackIcon, path: '/assets' },
  { label: 'Swap', icon: ArrowPathIcon, path: '/swap' },
  { label: 'Transactions', icon: DocumentTextIcon, path: '/transactions' },
  { label: 'Address book', icon: BookOpenIcon, path: '/address-book' },
  { label: 'Apps', icon: Squares2X2Icon, path: '/apps' },
  { label: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
];

const footerMenuItemsData = [
  { label: "What's new", icon: InformationCircleIcon, path: '/whats-new' },
  { label: "Need help?", icon: ChatBubbleLeftRightIcon, path: '/help' },
];

const SidebarContainer = styled.div`
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.fg};
  width: 230px;
  height: 100vh;
  position: fixed;
  top: 70px; /* Height of the navbar */
  left: 0;
  bottom: 0;
  padding: 20px 0;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  
  svg {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
`;

const ProfileSection = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.fg}33;
  margin-bottom: 10px;
`;

const Balance = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: ${props => props.theme.fg};
`;

const MenuList = styled.ul`
  list-style: none;
  /* set to default 
      browser default includes a
      padding-left (for indent)
      and margin-top and margin-bottom.
  */
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li<{ active?: boolean }>`
  padding: 12px 20px;
  display: flex;
  align-items: centor;
  cursor: pointer;
  color: ${props => props.theme.fg};
  background-color: ${props => props.active ? `${props.theme.primary.DEFAULT}22` : 'transparent'};
  border-left: ${props => props.active ? `4px solid ${props.theme.primary.DEFAULT}` : '4px solid transparent'};
  
  &:hover {
    background-color: ${props => `${props.theme.primary.DEFAULT}11`};
  }
`;

const FooterSection = styled.div`
  padding: 15px;
  margin-top: auto;
  border-top: 1px solid ${props => props.theme.fg}33;
  font-size: 14px;
`;

const trimWalletAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-3)}`;
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // TODO: implement copying function for contract address
  // TODO: or maybe add a popup to: (1) copy (2) show qrcode
  const handleCopyAddress = () => {
    // navigator.clipboard.writeText()
    console.log('Copy address button clicked!');
  };

  // TODO: implement new transaction function
  const handleNewTransactionClick = () => {
    console.log('New transaction button clicked!');
  };

  return (
    <SidebarContainer>
      <ProfileSection>
        <AddressButton onClick={handleCopyAddress}>
          {/* TODO: This should be replaced by the contract account address*/}
          {trimWalletAddress("0x05d13119e1ed67aA0E54fe7E832e0F4Ba1F34AFe")}
        </AddressButton>
        <Balance>
          $0
        </Balance>
        <ActionButton onClick={handleNewTransactionClick}>New transaction</ActionButton>
      </ProfileSection>
      
      <MenuList>
        {menuItemsData.map((item) => (
          <Link to={item.path} key={item.label} style={{ textDecoration: 'none', color: 'inherit' }}>
            <MenuItem active={activePath === item.path}>
              <item.icon /> {item.label}
            </MenuItem>
          </Link>
        ))}
      </MenuList>
      
      <FooterSection>
        {footerMenuItemsData.map((item) => (
          <Link to={item.path} key={item.label} style={{ textDecoration: 'none', color: 'inherit' }}>
            <MenuItem active={activePath === item.path}>
              <item.icon /> {item.label}
            </MenuItem>
          </Link>
        ))}
      </FooterSection>
    </SidebarContainer>
  );
};

export default Sidebar;
