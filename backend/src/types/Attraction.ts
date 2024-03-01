interface Attraction {
  id: string
  name: string
  description: string
  price: number
  author: {
    uid: string
    displayName: string
    photoURL: string
  }
  timestamp: Date
}

export default Attraction
