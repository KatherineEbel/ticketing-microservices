import React, { useEffect } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

export default () => {
  const { doRequest } = useRequest({
    url: `/api/users/signout`,
    method: `post`,
    body: {},
    onSuccess: () => Router.push(`/`)
  })
  
  useEffect(() => {
    async function signOut() {
      await doRequest()
    }
    signOut()
  }, [])
  
  return (
    <div>Signing you out...</div>
  )
}
