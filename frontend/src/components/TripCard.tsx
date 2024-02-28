import { useNavigate } from "react-router-dom"
import { Trip } from "../types/Trip"
import { Card } from "@mui/material"

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
        <Card
            className="hover:cursor-pointer"
            onClick={navigateToTripPage}
            sx={{ px: 2, py: 3}}
        >
            <p className="text-3xl font-bold">{tripCardProps.trip.name}</p>
            <div className="flex gap-2">
                <p>{startDate.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit'})}</p>
                <p>to</p>
                <p>{endDate.toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit'})}</p>
            </div>
        </Card>
    )
}

export default TripCard