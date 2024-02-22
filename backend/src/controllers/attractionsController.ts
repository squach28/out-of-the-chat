import type { Request, Response } from 'express'
import admin from 'firebase-admin'

const DB_NAME = 'trips'

// export const getAttractionById = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params
// }

export const addAttraction = async (req: Request, res: Response): Promise<void> => {
  const tripId = req.query.tripId as string
  const attraction = req.body
  try {
    if (tripId === undefined) {
      res.status(400).json('Missing tripId')
    } else {
      const doc = await admin.firestore().collection(DB_NAME).doc(tripId).get()
      if (!doc.exists) {
        res.status(404).json('Trip does not exist')
      } else {
        await doc.ref.update({
          attractions: admin.firestore.FieldValue.arrayUnion(attraction)
        })
        res.status(200).json('success')
      }
    }
  } catch (e) {
    console.log(e)
  }
}
