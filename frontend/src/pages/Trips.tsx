import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { Trip } from "../types/Trip"
import { getAuth } from "firebase/auth"
import { useNavigate } from "react-router-dom"

const Trips = () => {
    const [trips, setTrips] = useState<Trip[] | null>(null)
    const navigate = useNavigate()
    useEffect(() => {
        const auth = getAuth()

        if(auth.currentUser === null) {
            navigate('/login', { replace: true })
        } else {
            fetch(`${import.meta.env.VITE_API_URL}/trips?uid=${auth.currentUser.uid}`)
                .then(res => res.json())
                .then(data => setTrips(data))
        }
    }, [navigate])
    return (
        <div>
            <Navbar />
            <div className="p-4">
                <h1 className="text-3xl font-bold">Your Trips</h1>
                { trips ? 
                    <ul>
                        {trips.map(trip => <li key={trip.id}>{trip.name}</li>)}
                    </ul>
                : 
                    <p>Loading...</p>
                }
            </div>
        </div>
    )
}

export default Trips