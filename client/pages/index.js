import React from 'react'
import buildClient from '../api/build-client'

const LandingPage = ({ currentUser}) => {
  return (
    <div className="container">
      { currentUser ? <p>Signed in as { currentUser.email }</p> : <p>You are signed out</p>}
    </div>
  )
}


LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context)
  const { data } = await client.get(`/api/users/currentuser`)
  return data
}

export default LandingPage


