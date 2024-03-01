import type { Request, Response } from 'express'
import admin from 'firebase-admin'
import { addToFeed, createFeed } from '../utils/feedUtil'
import type { FeedItem } from '../types/FeedItem'

const DB_NAME = 'trips'
const FEED_DB_NAME = 'feed'

export const getTripById = async (req: Request, res: Response): Promise<void> => {
  const tripId = req.params.id
  try {
    const doc = await admin.firestore().collection(DB_NAME).doc(tripId).get()
    if (!doc.exists) {
      res.status(404).json({ message: 'Error: Trip not found' })
    }
    const data = doc.data()
    res.status(200).json(data)
  } catch (e) {
    console.log(e)
  }
}

export const getTripByUid = async (req: Request, res: Response): Promise<void> => {
  const uid = req.query.uid
  try {
    const tripDocs = await admin.firestore().collection(DB_NAME).where('author.uid', '==', uid).get()
    const trips = tripDocs.docs.map(doc => {
      return doc.data()
    })
    res.status(200).json(trips)
  } catch (e) {
    console.log(e)
  }
}

export const createTrip = async (req: Request, res: Response): Promise<void> => {
  const { name, location, startDate, endDate, author } = req.body
  try {
    const tripsCollection = admin.firestore().collection(DB_NAME)
    const tripDoc = tripsCollection.doc()
    await tripDoc.set({
      id: tripDoc.id,
      name,
      location,
      startDate,
      endDate,
      author
    })
    const feedItem: FeedItem = {
      action: 'CREATE',
      type: 'TRIP',
      name,
      author: {
        uid: author.uid,
        displayName: author.displayName,
        photoURL: author.photoURL
      },
      timestamp: new Date()
    }
    await createFeed(tripDoc.id)
    await addToFeed(tripDoc.id, feedItem)
    res.status(201).json({ id: tripDoc.id, name })
  } catch (e) {
    console.log(e)
  }
}

export const deleteTripById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params
  try {
    await admin.firestore().collection(DB_NAME).doc(id).delete()
    await admin.firestore().collection(FEED_DB_NAME).doc(id).delete()
    res.sendStatus(204)
  } catch (e) {
    console.log(e)
  }
}
