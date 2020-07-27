import { error } from 'next/dist/build/output/log'
import Router from 'next/router'
import React, { useState } from 'react'
import useRequest from '../../hooks/use-request'

const NewTicket = () => {
  const [title, setTitle] = useState(``)
  const [price, setPrice] = useState(``)
  const { doRequest, errors } = useRequest({
    url: `/api/tickets`,
    method: `post`,
    body: { title, price },
    onSuccess: (ticket) => {
      Router.push(`/`)
      setPrice(``)
      setTitle(``)
    }
  })
  const onSubmit = (e) => {
    e.preventDefault()
    doRequest()
  }
  
  const onBlur = (e) => {
    const value = parseFloat(price)
    if (isNaN(value)) {
      return
    }
    setPrice(value.toFixed(2))
  }
  
  return (
    <div>
      <h1>New Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" className="form-control"
                 onChange={(e) => setTitle(e.target.value)}
                 value={title}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input type="number" className="form-control"
                 onChange={(e) => setPrice(e.target.value)}
                 onBlur={onBlur}
                 value={price}
          />
        </div>
        { errors }
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default NewTicket
