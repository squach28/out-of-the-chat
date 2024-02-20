import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Trip } from "../types/Trip"
import Attractions from "../components/Attractions"
import Itinerary from "../components/Itinerary"
import Restaurants from "../components/Restaurants"
import Hotels from "../components/Hotels"
import Feed from "../components/Feed"
import Breadcrumbs from "../components/Breadcrumbs"

enum TripDetailsView {
    FEED,
    ITINERARY,
    ATTRACTIONS,
    RESTAURANTS,
    HOTELS
}

const TripDetails = () => {
    const { id } = useParams()
    const [trip ,setTrip] = useState<Trip | null>(null)
    const [selected, setSelected] = useState<TripDetailsView>(TripDetailsView.ITINERARY)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/trips/${id}`)
            .then(res => res.json())
            .then(data => setTrip(data))
    }, [id])

    const onTripDetailsViewClicked = (e: React.MouseEvent<HTMLLIElement>) => {
        const target = e.target as HTMLLIElement
        switch(target.id) {
            case 'feed':
                setSelected(TripDetailsView.FEED)
                return                
            case 'itinerary':
                setSelected(TripDetailsView.ITINERARY)
                return
            case 'hotels': 
                setSelected(TripDetailsView.HOTELS)
                return
            case 'attractions':
                setSelected(TripDetailsView.ATTRACTIONS)
                return
            case 'restaurants':
                setSelected(TripDetailsView.RESTAURANTS)
                return
            default:
                return
        }
    }

    const renderCategoryComponent = () => {
        switch(selected) {
            case TripDetailsView.FEED:
                return <Feed />
            case TripDetailsView.ITINERARY:
                return <Itinerary />
            case TripDetailsView.ATTRACTIONS:
                return <Attractions tripId={id as string} />
            case TripDetailsView.RESTAURANTS:
                return <Restaurants />
            case TripDetailsView.HOTELS:
                return <Hotels />                              
            default:
                return null
        }
    }
    
    return (
        <div>
            <div className="p-4">
                {trip ? 
                    <div>
                        <Breadcrumbs data={trip} />
                        <h1 className="text-4xl font-bold">{trip.name}</h1>
                        <ul className="flex justify-between my-4">
                            <li className={`${selected === TripDetailsView.FEED ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md hover:cursor-pointer`} id="feed" onClick={onTripDetailsViewClicked}>Feed</li>
                            <li className={`${selected === TripDetailsView.ITINERARY ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md hover:cursor-pointer`} id="itinerary" onClick={onTripDetailsViewClicked}>Itinerary</li>
                            <li className={`${selected === TripDetailsView.ATTRACTIONS ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md hover:cursor-pointer`} id="attractions" onClick={onTripDetailsViewClicked}>Attractions</li>
                            <li className={`${selected === TripDetailsView.RESTAURANTS ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md hover:cursor-pointer`} id="restaurants" onClick={onTripDetailsViewClicked}>Restaurants</li>
                            <li className={`${selected === TripDetailsView.HOTELS ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md hover:cursor-pointer`} id="hotels" onClick={onTripDetailsViewClicked}>Hotels</li>
                        </ul>
                        {renderCategoryComponent()}
                    </div> 
                    : 
                    null
                }
            </div>
        </div>
    )
}

export default TripDetails