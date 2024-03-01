import type { Request, Response } from 'express'
import admin from 'firebase-admin'
import { addToFeed } from '../utils/feedUtil'
import type { FeedItem } from '../types/FeedItem'
import type Attraction from '../types/Attraction'

const DB_NAME = 'trips'

export const getAttractionsByTripId = async (req: Request, res: Response): Promise<void> => {
  const { tripId } = req.params
  try {
    const attractions = admin.firestore().collection(DB_NAME).doc(tripId).collection('attractions')
    attractions.get()
      .then(snapshot => {
        const arr = snapshot.docs.map(doc => {
          return doc.data()
        })
        res.status(200).json(arr)
      })
      .catch(e => {
        res.status(500)
      })
  } catch (e) {
    console.log(e)
  }
}

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
      await admin.firestore().collection(DB_NAME).doc(tripId).collection('attractions').doc(attraction.id).create(attraction)
      const feedItem: FeedItem = {
        action: 'ADD',
        type: 'ATTRACTION',
        name: attraction.name,
        author: {
          uid: attraction.author.uid,
          displayName: attraction.author.displayName,
          photoURL: attraction.author.photoURL
        },
        timestamp: new Date(attraction.timestamp)
      }
      await addToFeed(tripId, feedItem)
      res.status(200).json('success')
    }
  } catch (e) {
    console.log(e)
  }
}

export const updateAttractionById = async (req: Request, res: Response): Promise<void> => {
  const tripId = req.query.tripId as string
  const { attractionId } = req.params
  const attraction: Attraction = {
    ...req.body
  }
  try {
    await admin.firestore().collection(DB_NAME).doc(tripId).collection('attractions').doc(attractionId).update({
      ...attraction
    })
    const feedItem: FeedItem = {
      action: 'UPDATE',
      type: 'ATTRACTION',
      name: attraction.name,
      author: {
        uid: attraction.author.uid,
        displayName: attraction.author.displayName,
        photoURL: attraction.author.photoURL
      },
      timestamp: new Date(attraction.timestamp)
    }
    await addToFeed(tripId, feedItem)
    res.status(201).json({ id: attractionId })
  } catch (e) {
    console.log(e)
    res.status(500).json('Something went wrong')
  }
}

export const deleteAttractionById = async (req: Request, res: Response): Promise<void> => {
  const tripId = req.query.tripId as string
  const { attractionId } = req.params
  try {
    const deletedAttraction = await admin.firestore().collection(DB_NAME).doc(tripId).collection('attractions').doc(attractionId).get()
    const deletedAttractionData = deletedAttraction.data()
    if (deletedAttractionData !== undefined) {
      await admin.firestore().collection(DB_NAME).doc(tripId).collection('attractions').doc(attractionId).delete()
      const feedItem: FeedItem = {
        action: 'REMOVE',
        type: 'ATTRACTION',
        name: deletedAttractionData.name,
        author: {
          uid: deletedAttractionData.author.uid,
          displayName: deletedAttractionData.author.displayName,
          photoURL: deletedAttractionData.author.photoURL
        },
        timestamp: new Date()
      }
      await addToFeed(tripId, feedItem)
      res.sendStatus(204)
    }
  } catch (e) {
    console.log(e)
  }
}
