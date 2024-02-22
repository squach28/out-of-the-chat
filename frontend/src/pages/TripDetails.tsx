import { Link, Outlet, useLocation, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Trip } from "../types/Trip"
import Breadcrumbs from "../components/Breadcrumbs"

enum TripDetailsView {
    FEED = 'feed',
    ITINERARY = 'itinerary',
    ATTRACTIONS = 'attractions',
    RESTAURANTS = 'restaurants',
    HOTELS = 'hotels'
}

const TripDetails = () => {
    const { id } = useParams()
    const [trip ,setTrip] = useState<Trip | null>(null)
    const location = useLocation()
    
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/trips/${id}`)
            .then(res => res.json())
            .then(data => setTrip(data))
    }, [id])

    const getCurrentPage = () => {
        const path = location.pathname
        const splitPath = path.split('/')
        return splitPath[splitPath.length - 1]
    }

    return (
        <div className="overflow-x-hidden">
            <div className="p-4">
                {trip ? 
                    <div>
                        <Breadcrumbs data={trip} />
                        <h1 className="text-4xl font-bold">{trip.name}</h1>
                        <div className="md:grid md:grid-cols-6 md:grid-rows-1 md:gap-8">
                            <ul className="flex gap-2 md:flex-col my-4">
                                <li className={`${getCurrentPage() === TripDetailsView.FEED ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md hover:cursor-pointer`} id="feed"><Link className="w-full inline-block" to={`/trips/${trip.id}/feed`}>Feed</Link></li>
                                <li className={`${getCurrentPage()  === TripDetailsView.ITINERARY ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md hover:cursor-pointer`} id="itinerary"><Link className="w-full inline-block" to={`/trips/${trip.id}/itinerary`}>Itinerary</Link></li>
                                <li className={`${getCurrentPage()  === TripDetailsView.ATTRACTIONS ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md hover:cursor-pointer`} id="attractions"><Link className="w-full inline-block" to={`/trips/${trip.id}/attractions`}>Attractions</Link></li>
                                <li className={`${getCurrentPage()  === TripDetailsView.RESTAURANTS ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md hover:cursor-pointer`} id="restaurants"><Link className="w-full inline-block" to={`/trips/${trip.id}/restaurants`}>Restaurants</Link></li>
                                <li className={`${getCurrentPage()  === TripDetailsView.HOTELS ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md hover:cursor-pointer`} id="hotels"><Link className="w-full inline-block" to={`/trips/${trip.id}/hotels`}>Hotels</Link></li>
                            </ul>
                            <div className="md:grid md:col-span-5">
                                <Outlet context={trip} />
                            </div>
                        </div>
                    </div> 
                    : 
                    null
                }
            </div>
        </div>
    )
}

export default TripDetails