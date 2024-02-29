import type { FeedItem } from '../types/FeedItem'
import admin from 'firebase-admin'

const DB_NAME = 'feed'
export const addToFeed = async (tripId: string, feedItem: FeedItem): Promise<void> => {
  try {
    const feedCollection = admin.firestore().collection(DB_NAME)
    const feedDoc = feedCollection.doc(tripId).collection(DB_NAME).doc()
    await feedDoc.set({
      ...feedItem,
      id: feedDoc.id
    })
  } catch (e) {
    console.log(e)
  }
}

export const createFeed = async (tripId: string): Promise<void> => {
  try {
    await admin.firestore().collection(DB_NAME).doc(tripId).create({})
  } catch (e) {
    console.log(e)
  }
}
