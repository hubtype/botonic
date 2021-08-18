import { Router } from 'express'
import { sign } from 'jsonwebtoken'

const router = Router()

router.route('/').post(async (req: any, res) => {
  // TODO: Restrict access to this endpoint
  const { userId } = req.body
  const PRIVATE_KEY = 'shhhhhh'
  const token = sign({ userId }, PRIVATE_KEY, {
    algorithm: 'HS256',
    expiresIn: '24h',
  })
  res.json({ token })
})
export default router
