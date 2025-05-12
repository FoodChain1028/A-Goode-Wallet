import React from 'react';
import styled from 'styled-components';
import { ActionButton } from '../components/Buttons';
import { Card, BalanceCard, TransactionsCard } from '../components/Cards';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
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
