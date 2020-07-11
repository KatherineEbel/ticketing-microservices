import axios from 'axios'
import React, { useState } from 'react'

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)
  
  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body)
      if (onSuccess) {
        onSuccess(response.data)
      }
      return response.data
    } catch (e) {
      setErrors(<div className="alert alert-danger">
        <h4>Oops...</h4>
        <ul className="my-0">
          { e.response.data
             .errors
             .map(({ message }) => (<li key={message}>{ message }</li>))
          }
        </ul>
      </div>)
    }
  }
  return { doRequest, errors }
}
