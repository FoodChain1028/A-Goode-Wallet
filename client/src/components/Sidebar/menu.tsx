import styled from 'styled-components'

export const MenuList = styled.ul`
  margin-top: 40px;
  list-style: none;
  /* set to default 
      browser default includes a
      padding-left (for indent)
      and margin-top and margin-bottom.
  */
  padding: 0;
  margin: 0;
`

export const MenuItem = styled.li<{ active?: boolean; collapsed?: boolean }>`
  padding: ${props => (props.collapsed ? '12px 10px' : '12px 20px')};
  display: flex;
  align-items: center;
  justify-content: ${props => (props.collapsed ? 'center' : 'flex-start')};
  cursor: pointer;
  color: ${props => props.theme.fg};
  background-color: ${props => (props.active ? `${props.theme.primary.DEFAULT}22` : 'transparent')};
  border-left: ${props =>
    props.active ? `4px solid ${props.theme.primary.DEFAULT}` : '4px solid transparent'};

  &:hover {
    background-color: ${props => `${props.theme.primary.DEFAULT}11`};
  }
`
