import { styled } from 'styled-components';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const BasicButton = styled.button`
  color: white;
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
    background-color: ${props => props.theme.primary.hover}
  }
`;

const ActionButtonComp = styled(BasicButton)`
  background-color: ${props => props.theme.primary.DEFAULT};
`;

const AddressButtonComp = styled(BasicButton)`
  background-color: ${props => props.theme.primary.hover};
  color: white;

  &:hover {
    background-color: ${props => props.theme.primary.active};
  }
`;

const ActionButton: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return <ActionButtonComp {...rest}>{children}</ActionButtonComp>;
};

const AddressButton: React.FC<ButtonProps> = ({ children, ...rest}) => {
  return <AddressButtonComp {...rest}>{children}</AddressButtonComp>;
}

export { ActionButton, AddressButton };