import { Link } from "react-router-dom"

type AttractionsProps = {
    tripId: string
}

const Attractions = (attractionsProps: AttractionsProps) => {

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Attractions</h1>
                <Link to={`/trips/${attractionsProps.tripId}/addAttraction`} className="bg-green-400 text-black font-bold px-2 py-3 rounded-md">Add attraction</Link>
            </div>
            <h2>Suggested Attractions</h2>
        </div>
    )
}

export default Attractions