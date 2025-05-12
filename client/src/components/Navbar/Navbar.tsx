import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// to remove the default underline of the link
const StyledLogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  
  img {
    height: 36px;
    margin-right: 10px;
  }
`;

const LogoText = styled.span`
  font-family: 'Nunito', cursive;
  font-weight: 900;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 14px;
  line-height: 18px;
  height: 36px;
  color: #000000; /* Set text color to black */
`;


const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.fg};
  padding: 0 20px;
  height: 70px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.theme.primary.muted};
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Navbar: React.FC = () => {
  return (
    <NavbarContainer>
      <StyledLogoLink to="/">
        <Logo>
          <img src="/logo/agw_light.png" alt="A-Goode Wallet" />
          <LogoText>
            <span style={{ fontSize: '14px' }}>A GOODE</span>
            <span style={{ fontSize: '14px' }}>&nbsp;WALLET</span>
          </LogoText>
        </Logo>
      </StyledLogoLink>
      <NavActions>
        <WalletInfo>
          0x47778 ETH
          <Avatar>
            {/* Avatar content */}
          </Avatar>
        </WalletInfo>
      </NavActions>
    </NavbarContainer>
  );
};

export default Navbar;
