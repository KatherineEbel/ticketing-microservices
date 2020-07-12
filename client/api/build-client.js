import axios from 'axios'

export default ({ req }) => {
  if (typeof window === 'undefined') {
    const { headers } = req
    return axios.create({
      baseURL: `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local`,
      headers
    })
  } else {
    return axios.create({
      baseURL: `/`,
    })
  }
}
