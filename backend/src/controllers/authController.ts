import type { Request, Response } from 'express'
import admin from 'firebase-admin'

export const isUserVerified = async (req: Request, res: Response): Promise<void> => {
  const email = req.query.email as string
  try {
    const user = await admin.auth().getUserByEmail(email)
    res.status(200).json({ verified: user.emailVerified })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
