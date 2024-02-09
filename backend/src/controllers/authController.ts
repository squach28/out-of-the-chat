import type { Request, Response } from 'express'
import type { FirebaseError } from 'firebase-admin'
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

export const createAccount = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body)
  const { firstName, lastName, email, password } = req.body
  try {
    const result = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`
    })
    const resMessage = {
      email: result.email,
      uid: result.uid
    }
    res.status(201).json(resMessage)
  } catch (e) {
    const errCode = e as FirebaseError
    switch (errCode.code) {
      case 'auth/email-already-exists':
        res.status(400).json({ message: errCode.message })
        break
      default:
        res.status(500).json({ message: 'Something went wrong' })
        break
    }
  }
}
