import { useNavigate } from "react-router-dom"
import { Trip } from "../types/Trip"

type TripCardProps = {
    trip: Trip
}

const TripCard = (tripCardProps: TripCardProps) => {
    const startDate = new Date(tripCardProps.trip.startDate)
    const endDate = new Date(tripCardProps.trip.endDate)
    const navigate = useNavigate()

    const navigateToTripPage = () => {
        const id = tripCardProps.trip.id
        navigate(`/trips/${id}/feed`)
    }   

    return (
        <div className="p-2 rounded-md shadow-md bg-gray-200 hover:cursor-pointer" onClick={navigateToTripPage}>
            <p className="text-3xl font-bold">{tripCardProps.trip.name}</p>
            <div className="flex gap-2">
                <p>{startDate.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit'})}</p>
                <p>to</p>
                <p>{endDate.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit'})}</p>
            </div>
        </div>
    )
}

export default TripCard