import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { SwitchButton } from '../Buttons'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../../hooks/useTheme'

// to remove the default underline of the link
const StyledLogoLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
`

const Logo = styled.div`
  font-weight: 700;
  display: flex;
  align-items: center;

  img {
    height: 40px;
    margin-right: 2.5px;
  }
`

const LogoText = styled.span`
  color: ${props => props.theme.fg};
  font-family: 'Nunito', cursive;
  font-weight: 800;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 18px;
  line-height: 17px;
  height: 50px;
`

const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* separate them in the two side of navbar*/
  background-color: ${props => props.theme.bg};
  color: ${props => props.theme.font};
  padding: 0 20px;
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.primary.hover};
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.primary.active};
  }
`

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
`

const Navbar: React.FC = () => {
  const { themeMode, toggleTheme } = useTheme()

  return (
    <NavbarContainer>
      <StyledLogoLink to="/">
        <Logo>
          <img src="/logo/agw_light.png" alt="A-Goode Wallet" />
          <LogoText>
            <span>A GOODE</span>
            <span>&nbsp;WALLET</span>
          </LogoText>
        </Logo>
      </StyledLogoLink>
      <NavActions>
        <SwitchButton onClick={toggleTheme}>
          {themeMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </SwitchButton>
        <WalletInfo>
          200.47778 ETH
          <Avatar>{/* Avatar content */}</Avatar>
        </WalletInfo>
      </NavActions>
    </NavbarContainer>
  )
}

export default Navbar
