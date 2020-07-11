import Router from 'next/router'
import React, { useState } from 'react'

import useRequest from '../../hooks/use-request'

export default () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { doRequest, errors } = useRequest({
    url: `/api/users/signup`,
    method: `post`,
    body: { email, password },
    onSuccess: () => Router.push(`/`)
  })
  const handleSubmit = async (e) => {
    e.preventDefault()
    await doRequest()
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      { errors }
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input type="text" className="form-control"
               onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" className="form-control"
               onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}
