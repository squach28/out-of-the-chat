export interface FeedItem {
  id?: string
  action: 'CREATE' | 'ADD' | 'REMOVE' | 'UPDATE'
  name: string
  type: 'TRIP' | 'ATTRACTION' | 'HOTEL' | 'RESTAURANT' | 'ITINERARY'
  author: {
    uid: string
    displayName: string
    photoURL: string
  }
  timestamp?: Date
}
