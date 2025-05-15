import styled from 'styled-components'

const Card = styled.div`
  background-color: ${props => props.theme.bg};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${props => props.theme.shadow};
`

const BalanceCard = styled(Card)`
  h2 {
    margin-top: 0;
    color: ${props => props.theme.fg};
    font-size: 16px;
  }

  .balance {
    font-size: 32px;
    font-weight: 700;
    margin: 10px 0;
  }

  .actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
`

const TransactionsCard = styled(Card)`
  grid-column: span 2;

  h2 {
    margin-top: 0;
    color: ${props => props.theme.fg};
    font-size: 16px;
    margin-bottom: 20px;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;

    svg {
      margin-bottom: 20px;
      color: ${props => props.theme.fg};
      opacity: 0.7;
    }

    p {
      color: ${props => props.theme.fg};
      opacity: 0.7;
      text-align: center;
    }
  }
`

export { Card, BalanceCard, TransactionsCard }
