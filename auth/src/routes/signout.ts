import express from 'express'

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
  req.session = null
  res.status(204).end()
})

export { router as signoutRouter }
