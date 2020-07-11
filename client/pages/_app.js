import React from 'react'
import 'bootstrap/dist/css/bootstrap.css'

// wrapper around next component to include global css
export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />
}
