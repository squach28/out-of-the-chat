import type { Request, Response } from 'express'
import admin from 'firebase-admin'
import type Attraction from '../types/Attraction'
import type Hotel from '../types/Hotel'
import type Restaurant from '../types/Restaurant'

const DB_NAME = 'trips'

export const getFeedByTripId = async (req: Request, res: Response): Promise<void> => {
  const { tripId } = req.params
  console.log(tripId)
  try {
    const doc = await admin.firestore().collection(DB_NAME).doc(tripId).get()
    const attractions: Attraction[] = doc.get('attractions')
    const restaurants: Restaurant[] = doc.get('restaurants')
    const hotels: Hotel[] = doc.get('hotels')
    const resources: Array<Attraction | Restaurant | Hotel> = [...attractions, ...restaurants, ...hotels]
    console.log(resources)
    res.status(200).json(resources)
  } catch (e) {
    console.log(e)
  }
}
