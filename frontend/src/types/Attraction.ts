export type Attraction = {
    id: string 
    name: string
    description: string
    url?: string
    price: number
    timestamp?: Date
    author: {
        uid: string
        displayName: string 
        photoURL: string
    }
}