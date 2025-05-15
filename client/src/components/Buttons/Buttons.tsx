import { styled } from 'styled-components'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

const BasicButton = styled.button`
  color: ${props => props.theme.fg};
  border: none;
  border-radius: 6px;
  padding: 10px 15px;
  width: 100%;
  margin: 5px 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  font-family: 'Nunito', sans-serif; /* button doesn't inherit font-family */
  box-sizing: border-box;

  &:hover {
    background-color: ${props => props.theme.primary.hover};
  }
`

const ActionButtonComp = styled(BasicButton)<{ primary?: boolean }>`
  background-color: ${props => (props.primary ? props.theme.primary.DEFAULT : 'transparent')};
  color: ${props => (props.primary ? 'white' : props.theme.primary.DEFAULT)};
  border: ${props => (props.primary ? 'none' : `1px solid ${props.theme.primary.DEFAULT}`)};

  &:hover {
    background-color: ${props =>
      props.primary ? props.theme.primary.hover : props.theme.primary.active};
    color: white;
  }
`

const AddressButtonComp = styled(BasicButton)`
  background-color: ${props => props.theme.primary.hover};
  color: ${props => props.theme.font};

  &:hover {
    background-color: ${props => props.theme.primary.active};
  }
`

const SwitchButtonComp = styled.button`
  background-color: ${props => props.theme.primary.active};
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ActionButton: React.FC<ButtonProps & { primary?: boolean }> = ({
  primary,
  children,
  ...rest
}) => {
  return (
    <ActionButtonComp primary={primary} {...rest}>
      {children}
    </ActionButtonComp>
  )
}

const AddressButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <AddressButtonComp {...rest}>{children}</AddressButtonComp>
}

const SwitchButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <SwitchButtonComp {...rest}>{children}</SwitchButtonComp>
}

export { ActionButton, AddressButton, SwitchButton }
