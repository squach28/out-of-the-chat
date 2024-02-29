export interface FeedItem {
  id?: string
  action: 'CREATE' | 'ADD' | 'REMOVE' | 'UPDATE'
  name: string
  type: 'TRIP' | 'ATTRACTION' | 'HOTEL' | 'RESTAURANT' | 'ITINERARY'
  author: {
    uid: string
    name: string
    photoURL: string
  }
  timestamp?: Date
}
