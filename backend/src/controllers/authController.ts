import type { Request, Response } from 'express'
import type { FirebaseError } from 'firebase-admin'
import admin from 'firebase-admin'
import { getStorage } from 'firebase-admin/storage'
import { sendEmailVerification, sendResetPasswordEmail } from '../utils/mailUtil'

export const isUserVerified = async (req: Request, res: Response): Promise<void> => {
  const email = req.query.email as string
  try {
    const user = await admin.auth().getUserByEmail(email)
    res.status(200).json({ verified: user.emailVerified })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

const retrieveDefaultProfilePictureURL = async (): Promise<string> => {
  const DEFAULT_PROFILE_PICTURE_PATH = 'profile_pictures/default.jpeg'
  const bucket = getStorage().bucket()
  const file = await bucket.file(DEFAULT_PROFILE_PICTURE_PATH).get()
  const signedUrl = await file[0].getSignedUrl({
    action: 'read',
    expires: '05-20-2500'
  })
  return signedUrl[0]
}

export const createAccount = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password } = req.body
  const name = firstName + ' ' + lastName
  try {
    const result = await admin.auth().createUser({
      email,
      password,
      displayName: name
    })
    const resMessage = {
      email: result.email,
      uid: result.uid
    }
    const verifyEmailUrl = await admin.auth().generateEmailVerificationLink(email as string)
    const photoURL = await retrieveDefaultProfilePictureURL()
    admin.auth().updateUser(result.uid, {
      photoURL
    })
      .then((res) => { console.log(res) })
      .catch((e) => {
        console.log(e)
      })
    sendEmailVerification(email as string, firstName as string, verifyEmailUrl)
    res.status(201).json(resMessage)
  } catch (e) {
    const errCode = e as FirebaseError
    switch (errCode.code) {
      case 'auth/email-already-exists':
        res.status(400).json(e)
        break
      default:
        res.status(500).json({ message: 'Something went wrong' })
        break
    }
  }
}

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body
  console.log(email)
  try {
    const resetPasswordLink = await admin.auth().generatePasswordResetLink(email as string)
    console.log(email)
    sendResetPasswordEmail(email as string, resetPasswordLink)
    res.status(200).json({ email })
  } catch (e) {
    const errCode = e as FirebaseError
    switch (errCode.code) {
      case 'auth/internal-error':
        res.status(404).json({ message: "User with email wasn't found" })
        break
      default:
        res.status(500).json({ message: 'Something went wrong' })
        break
    }
  }
}
