import type { Request, Response } from 'express'
import admin from 'firebase-admin'

const DB_NAME = 'trips'

export const getTripById = async (req: Request, res: Response): Promise<void> => {
  const tripId = req.params.id
  console.log(tripId)
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

export const createTrip = async (req: Request, res: Response): Promise<void> => {
  const { name, location, startDate, endDate, createdBy } = req.body
  try {
    const tripsCollection = admin.firestore().collection(DB_NAME)
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
    res.status(201).json({ message: 'Success, trip was created' })
  } catch (e) {
    console.log(e)
  }
}
