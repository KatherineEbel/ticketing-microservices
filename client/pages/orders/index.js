import React from 'react'

const OrderIndex = ({ currentUser, orders }) => {
  return (
    <div>
      <h1>Order Index</h1>
      <p>Orders for { currentUser.email }</p>
      <ul>
        { orders.map(o => <li key={o.id}>
          <p>{o.ticket.title} - { o.status }</p>
        </li>)}
      </ul>
    </div>
  )
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data: orders } = await client.get(`/api/orders`)
  return { orders }
}

export default OrderIndex
