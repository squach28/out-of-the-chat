import { Restaurant } from "./Restuarant,"
import { Hotel } from "./Hotel"
import { Attraction } from "./Attraction"

export type Trip = {
    id: string
    name: string
    location: string 
    startDate: Date,
    endDate: Date
    restaurants: Restaurant[]
    hotels: Hotel[]
    attractions: Attraction[]
}   