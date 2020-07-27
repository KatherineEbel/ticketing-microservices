import React from 'react'

const LandingPage = ({ currentUser }) => {
  return (
    <div className="container">
      { currentUser ? <p>Signed in as { currentUser.email }</p> : <p>You are signed out</p>}
    </div>
  )
}


LandingPage.getInitialProps = async (context, client, currentUser) => {
  return { currentUser }
}

export default LandingPage


