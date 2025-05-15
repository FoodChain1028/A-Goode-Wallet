import React from 'react'

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div style={{ padding: '20px' }}>
    <h1>{title}</h1>
    <p>
      Content for <strong>{title.toLowerCase()} page</strong> will go here.
    </p>
  </div>
)

export default PlaceholderPage
