import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { Trip } from "../types/Trip"

enum TripDetailsView {
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
    
    return (
        <div>
            <Navbar />
            <div className="p-4">
                {trip ? 
                    <div>
                        <h1 className="text-4xl font-bold">{trip.name}</h1>
                        <ul className="flex justify-between my-4">
                            <li className={`${selected === TripDetailsView.ITINERARY ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md`} id="itinerary" onClick={onTripDetailsViewClicked}>Itinerary</li>
                            <li className={`${selected === TripDetailsView.ATTRACTIONS ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md`} id="attractions" onClick={onTripDetailsViewClicked}>Attractions</li>
                            <li className={`${selected === TripDetailsView.RESTAURANTS ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md`} id="restaurants" onClick={onTripDetailsViewClicked}>Restaurants</li>
                            <li className={`${selected === TripDetailsView.HOTELS ? 'bg-green-200 font-bold' : 'bg-transparent'} p-2 rounded-md`} id="hotels" onClick={onTripDetailsViewClicked}>Hotels</li>
                        </ul>
                    </div> 
                    : 
                    null
                }
            </div>
        </div>
    )
}

export default TripDetails