import { useEffect, useState } from "react"
import { Trip } from "../types/Trip"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import TripCard from "../components/TripCard"
import { Button } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'

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
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ display: "flex", gap: 1}}
                    >
                        <Link to="/createTrip">Create Trip</Link>
                        <AddIcon />
                    </Button>
                </div>
                { trips ? 
                    <ul className="grid lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
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