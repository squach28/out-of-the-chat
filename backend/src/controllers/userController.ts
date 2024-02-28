import type { Request, Response } from 'express'
import type fileUpload from 'express-fileupload'
import admin from 'firebase-admin'
import fs from 'fs'
import tmp from 'tmp'

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid } = req.params
    console.log(uid)
    const updatedInfo = req.body as object
    const update = await admin.auth().updateUser(uid, updatedInfo)
    console.log(update)
    res.status(200).json({ message: 'Success' })
  } catch (e) {
    console.log(e)
  }
}

const updateUserProfilePicture = async (uid: string, imgUrl: string): Promise<boolean> => {
  try {
    await admin.auth().updateUser(uid, {
      photoURL: imgUrl
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const uploadImageToStorage = async (uid: string, file: fileUpload.UploadedFile): Promise<string | null> => {
  tmp.file((err, filePath, fd, cleanup) => {
    if (err !== null) {
      throw err
    }
    fs.appendFileSync(filePath, file.data)
  })
  const tmpObj = tmp.fileSync()
  fs.appendFileSync(tmpObj.name, file.data)
  const name = file.name
  const bucket = admin.storage().bucket()
  const destination = `profile_pictures/${uid}/${name}`
  const options = {
    destination
  }
  try {
    const bucketUpload = await bucket.upload(tmpObj.name, options)
    const uploadedFile = bucketUpload[0]
    await uploadedFile.makePublic()
    return bucketUpload[0].publicUrl()
  } catch (e) {
    console.log(e)
    return null
  }
}

export const updateProfilePicture = async (req: Request, res: Response): Promise<void> => {
  const { uid } = req.params
  if (req.files === null || req.files === undefined) {
    res.status(400).json({ message: 'No file was attached' })
  } else {
    const file = req.files.file as fileUpload.UploadedFile
    const imgUrl = await uploadImageToStorage(uid, file)
    if (imgUrl !== null) {
      const result = await updateUserProfilePicture(uid, imgUrl)
      res.status(200).json(result)
    } else {
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
}
