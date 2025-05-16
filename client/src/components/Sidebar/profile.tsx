import styled from 'styled-components'

export const ProfileSection = styled.div<{ collapsed?: boolean }>`
  padding: ${props => (props.collapsed ? '10px' : '20px')};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${props => props.theme.fg}33;
  margin-bottom: 10px;
  height: 10em;
  overflow: hidden;
`

export const Balance = styled.div`
  font-size: 18px;
  font-weight: bold;
  // margin-bottom: 1px;
  color: ${props => props.theme.fg};
`
