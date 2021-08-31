import { Router } from 'express'
import { sign } from 'jsonwebtoken'

export default function authRouter(args) {
  const router = Router()

  router.route('/').post(async (req: any, res) => {
    // TODO: Restrict access to this endpoint
    const { userId } = req.body
    const token = sign({ userId }, process.env.BOTONIC_JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '24h', // TODO: Make it configurable?
    })
    res.json({ token })
  })
  return router
}
