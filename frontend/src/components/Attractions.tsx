import { Link, useOutletContext, useParams } from "react-router-dom"
import { Trip } from "../types/Trip"
import { Attraction } from "../types/Attraction"

type AttractionCardProps = {
    attraction: Attraction
}

const AttractionCard = (attractionCardProps: AttractionCardProps) => {
    return(
        <div className="border p-2 shadow-md max-w-xlg rounded-md">
            <div className="justify-between">
                <p className="text-2xl">{attractionCardProps.attraction.name}</p>
                <img src="" alt="" />
            </div>
            <p>{attractionCardProps.attraction.description}</p>
            {attractionCardProps.attraction.url ? 
                <div className="flex gap-1">
                    <a className="text-blue-500 underline" href={attractionCardProps.attraction.url}>External Link</a>
                </div>
                :
                null
            }
            <p>Price: <span>{attractionCardProps.attraction.price === 0 ? 'Free' : attractionCardProps.attraction.price}</span></p>
        </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
                {trip.attractions.map(attraction => <AttractionCard key={attraction.id} attraction={attraction} />)}
            </div>
            <h2>Suggested Attractions</h2>
        </div>
    )
}

export default Attractions