import React from 'react'
import axios from 'axios'

const LandingPage = ({ currentUser}) => {
  console.log(currentUser)
  return <h1>Landing Page Welcome:</h1>
}


LandingPage.getInitialProps = async () => {
  // http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
  // return response.data
  if (typeof window === 'undefined') {
    // code executing on server
    const { data } = await axios.get(
      `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser`,
      {
        headers: {
          Host: 'ticketing.dev'
        }
      }
    )
    return data
  } else {
    // code executing on browser
    const { data } = await axios.get(`/api/users/currentuser`)
    return data
  }
}

export default LandingPage


