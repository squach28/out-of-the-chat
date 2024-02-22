import { Link, useOutletContext, useParams } from "react-router-dom"
import { Trip } from "../types/Trip"
import { Attraction } from "../types/Attraction"

type AttractionCardProps = {
    attraction: Attraction
}

const AttractionCard = (attractionCardProps: AttractionCardProps) => {
    return(
        <li className="border p-2">
            <p>{attractionCardProps.attraction.name}</p>
        </li>
    )
}

const Attractions = () => {
    const { id } = useParams()
    const trip: Trip = useOutletContext()

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Attractions</h1>
                <Link to={`/trips/${id}/attractions/addAttraction`} className="bg-green-400 text-black font-bold px-2 py-3 rounded-md">Add attraction</Link>
            </div>

            <ul className="flex flex-col gap-2 my-2">
                {trip.attractions.map(attraction => <AttractionCard key={attraction.id} attraction={attraction} />)}
            </ul>
            <h2>Suggested Attractions</h2>
        </div>
    )
}

export default Attractions