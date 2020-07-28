import Link from 'next/link'
import React from 'react'

const LandingPage = ({ currentUser, tickets }) => {
  return (
    <div className="container">
      { currentUser ? <p>Signed in as { currentUser.email }</p> : <p>You are signed out</p>}
      <h2>Tickets</h2>
      { tickets.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          { tickets.map(t => (
            <div className="col p-2" key={t.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    { t.title }
                  </h5>
                  <p className="card-text">
                    Price ${ t.price }
                  </p>
                </div>
              </div>
              <div className="card-footer">
                { console.log(t.id)}
                <Link href="/tickets/[ticketId]" as={`/tickets/${t.id}`}>
                  <a className="btn btn-link">View</a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (<div>No tickets available</div>)}
    </div>
  )
}


LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get(`/api/tickets`)
  return { currentUser, tickets: data }
}

export default LandingPage


