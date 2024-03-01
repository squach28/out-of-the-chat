export type Trip = {
    id?: string
    name: string
    location: string 
    startDate: Date | null,
    endDate: Date | null
    author: {
        uid: string 
        displayName: string
        photoURL: string
    }
}   