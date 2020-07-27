import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'

import buildClient from '../api/build-client'
import Header from '../components/header'

// wrapper around next component to include global css
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}/>
      <main className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </main>
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  const { data } = await client.get(`/api/users/currentuser`)
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser)
  }
  return {
    pageProps,
    ...data
  }
}

export default AppComponent
