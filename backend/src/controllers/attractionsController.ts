import type { Request, Response } from 'express'
import admin from 'firebase-admin'
import { addToFeed } from '../utils/feedUtil'
import type { FeedItem } from '../types/FeedItem'
import type Attraction from '../types/Attraction'

const DB_NAME = 'trips'

// export const getAttractionById = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params
// }

export const addAttraction = async (req: Request, res: Response): Promise<void> => {
  const tripId = req.query.tripId as string
  const attraction: Attraction = {
    ...req.body,
    timestamp: new Date().toISOString()
  }
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
        const feedItem: FeedItem = {
          action: 'ADD',
          type: 'ATTRACTION',
          name: attraction.name,
          author: {
            uid: attraction.createdBy,
            name: '',
            photoURL: ''
          },
          timestamp: attraction.timestamp
        }
        await addToFeed(tripId, feedItem)
        res.status(200).json('success')
      }
    }
  } catch (e) {
    console.log(e)
  }
}
