import crypto from 'crypto'

export function sha256(message: string): string {
  return crypto.createHash('sha256').update(message).digest('hex')
}
