import React from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/orders/`,
    method: `post`,
    body: {
      ticketId: ticket.id
    },
    onSuccess: order => Router.push(`/orders/[orderId]`, `/orders/${ order.id }`)
  })
  return (
    <div>
      <h1>Ticket Show</h1>
      <h5>{ ticket.title }</h5>
      <p>${ticket.price}</p>
      { errors }
      <button className="btn btn-primary"
              onClick={() => doRequest()}
      >Purchase</button>
    </div>
  )
}

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query
  const { data } = await client.get(`api/tickets/${ticketId}`)
  return { ticket: data }
}

export default TicketShow
