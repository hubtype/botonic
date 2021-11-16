import { Router } from 'express'
import { sign } from 'jsonwebtoken'

export const SIGNATURE_ALGORITHM = 'HS256'
const EXPIRES_IN = '24h'

export default function authRouter(args) {
  const router = Router()

  router.route('/').post(async (req: any, res) => {
    // TODO: Restrict access to this endpoint
    const { userId, channel, idFromChannel } = req.body
    const token = sign(
      { userId, channel, idFromChannel },
      process.env.BOTONIC_JWT_SECRET,
      {
        algorithm: SIGNATURE_ALGORITHM,
        expiresIn: EXPIRES_IN, // TODO: Make it configurable?
      }
    )
    res.json({ token })
  })
  return router
}
