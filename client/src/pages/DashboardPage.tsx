import React from 'react';
import styled from 'styled-components';

// Styled Components (originally in App.tsx, specific to DashboardPage or closely related)
const DashboardContainer = styled.div`
  padding: 20px;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background-color: ${props => props.theme.bg};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

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
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  background-color: ${props => props.primary ? props.theme.primary.DEFAULT : 'transparent'};
  color: ${props => props.primary ? 'white' : props.theme.primary.DEFAULT};
  border: ${props => props.primary ? 'none' : `1px solid ${props.theme.primary.DEFAULT}`};
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: ${props => props.primary ? props.theme.primary.hover : props.theme.primary.muted};
  }
`;

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
`;

// DashboardPage Component
const DashboardPage: React.FC = () => (
  <DashboardContainer>
    <CardContainer>
      <BalanceCard>
        <h2>Total asset value</h2>
        <div className="balance">$0.00</div>
        <div className="actions">
          <ActionButton primary>Send</ActionButton>
          <ActionButton>Receive</ActionButton>
          <ActionButton>Swap</ActionButton>
        </div>
      </BalanceCard>
      
      <Card>
        <h2>Top assets</h2>
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <h3>Add funds to get started</h3>
          <p>Add funds directly from your bank account or copy your address to send tokens from a different account.</p>
        </div>
      </Card>
    </CardContainer>
    
    <TransactionsCard>
      <h2>Pending transactions</h2>
      <div className="empty-state">
        <div>
          {/* Placeholder for transaction icon */}
          ⏱️
        </div>
        <p>This Safe Account has no queued transactions</p>
      </div>
    </TransactionsCard>
  </DashboardContainer>
);

export default DashboardPage;
