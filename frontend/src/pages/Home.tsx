import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

const Home = () => {
    return (
        <div className="w-full flex flex-col items-center">
            <Navbar />
            <div className="mt-6">
                <Link className="w-1/2 text-2xl bg-button-light text-button-text-light rounded-md text-center px-3 py-2" to="/createTrip">Create Trip</Link>
            </div>
        </div>
    )
}

export default Home