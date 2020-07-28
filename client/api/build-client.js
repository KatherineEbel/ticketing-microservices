import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    const { headers } = req
    return axios.create({
      baseURL: `http://www.ticketing-dev.katherineebel.com`,
      headers
    })
  } else {
    return axios.create({
      baseURL: `/`,
    })
  }
}

export default buildClient
