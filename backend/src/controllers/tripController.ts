import type { Request, Response } from 'express'
import admin from 'firebase-admin'

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
    const tripDocs = await admin.firestore().collection(DB_NAME).where('createdBy', '==', uid).get()
    const trips = tripDocs.docs.map(doc => {
      return doc.data()
    })
    res.status(200).json(trips)
  } catch (e) {
    console.log(e)
  }
}

export const createTrip = async (req: Request, res: Response): Promise<void> => {
  const { name, location, startDate, endDate, createdBy } = req.body
  try {
    const tripsCollection = admin.firestore().collection(DB_NAME)
    const feedCollection = admin.firestore().collection(FEED_DB_NAME)
    const tripDoc = tripsCollection.doc()
    await tripDoc.set({
      id: tripDoc.id,
      name,
      location,
      startDate,
      endDate,
      createdBy,
      attractions: [],
      hotels: [],
      restaurants: []
    })

    const feedDoc = feedCollection.doc(tripDoc.id).collection('feed').doc()
    await feedDoc.set({
      id: feedDoc.id,
      action: 'CREATE',
      name,
      type: 'TRIP',
      author: createdBy,
      authorName: name,
      timestamp: new Date()
    })
    res.status(201).json({ id: tripDoc.id, name })
  } catch (e) {
    console.log(e)
  }
}
