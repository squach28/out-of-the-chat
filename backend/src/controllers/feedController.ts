import type { Request, Response } from 'express'
import admin from 'firebase-admin'

const DB_NAME = 'feed'

export const getFeedByTripId = async (req: Request, res: Response): Promise<void> => {
  const { tripId } = req.params
  console.log(tripId)
  try {
    const collection = admin.firestore().collection(DB_NAME).doc(tripId).collection('feed')
    collection.get()
      .then(snapshot => {
        const arr = snapshot.docs.map(doc => {
          return doc.data()
        })
        console.log(arr)
        res.status(200).json(arr)
      })
      .catch(e => {
        console.log(e)
        res.status(500)
      })
  } catch (e) {
    console.log(e)
  }
}
