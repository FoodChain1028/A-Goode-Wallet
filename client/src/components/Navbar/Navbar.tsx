import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { SwitchButton } from '../Buttons'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../../hooks/useTheme'
import { client } from '../../utils/twclient'
import { ConnectButton, lightTheme, darkTheme } from 'thirdweb/react'
import { inAppWallet, createWallet } from 'thirdweb/wallets'

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
  // color: ${props => props.theme.font};
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

// Use a wrapper div instead of styling ConnectButton directly
const ConnectButtonWrapper = styled.div`
  .tw-connect-wallet {
    background-color: ${props => props.theme.primary?.DEFAULT || '#555555'};
    color: white;
  }
`

const wallets = [
  inAppWallet({
    auth: {
      options: ['google', 'discord', 'telegram', 'x', 'passkey', 'email'],
    },
  }),
  createWallet('io.metamask'),
  createWallet('me.rainbow'),
  createWallet('io.rabby'),
  createWallet('io.zerion.wallet'),
  createWallet('com.coinbase.wallet'),
]

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
        <ConnectButtonWrapper>
          <ConnectButton
            client={client}
            wallets={wallets}
            theme={
              themeMode === 'light'
                ? lightTheme({
                    colors: {
                      borderColor: 'hsl(262, 23%, 92%)',
                      accentText: 'hsl(217, 21%, 29%)',
                    },
                  })
                : darkTheme({
                    colors: {
                      connectedButtonBg: '#333333',
                      accentText: '#FFFFFF',
                      borderColor: '#666666',
                      modalBg: '#333333',
                      primaryButtonBg: '#888888',
                      primaryButtonText: '#FFFFFF',
                      secondaryButtonHoverBg: '#888888',
                    },
                  })
            }
            connectModal={{ size: 'compact' }}
          />
        </ConnectButtonWrapper>
      </NavActions>
    </NavbarContainer>
  )
}

export default Navbar
