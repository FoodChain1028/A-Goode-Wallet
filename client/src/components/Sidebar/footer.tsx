import styled from 'styled-components'

export const FooterSection = styled.div<{ collapsed?: boolean }>`
  padding: ${props => (props.collapsed ? '10px' : '15px')};
  margin-top: auto;
  border-top: 1px solid ${props => props.theme.fg}33;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.collapsed ? 'center' : 'flex-start')};
`
