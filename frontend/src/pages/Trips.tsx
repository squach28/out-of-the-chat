import { useEffect, useState } from "react"
import { Trip } from "../types/Trip"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import plusIcon from '../assets/icons/plus-solid.svg'
import TripCard from "../components/TripCard"

const Trips = () => {
    const [trips, setTrips] = useState<Trip[] | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if(user) {
                fetch(`${import.meta.env.VITE_API_URL}/trips?uid=${user.uid}`)
                    .then(res => res.json())
                    .then(data => setTrips(data))
            }
        })
    }, [navigate])
    return (
        <div>
            <div className="p-4">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold">Your Trips</h1>
                    <Link className="w-[40%] max-w-36 flex justify-between items-center text-md bg-green-500 font-bold text-button-text-light rounded-md text-center px-3 py-2" to="/createTrip">
                        <p className="text-sm">Create Trip</p>
                        <img className="w-5 h-5" src={plusIcon} alt="plus icon" />
                    </Link>
                </div>
                { trips ? 
                    <ul className="flex flex-col gap-4 py-4">
                        {trips.map(trip => 
                            <li key={trip.id}>
                                <TripCard trip={trip} />
                            </li>
                        )}
                    </ul>
                : 
                    <p>Loading...</p>
                }
            </div>
        </div>
    )
}

export default Trips