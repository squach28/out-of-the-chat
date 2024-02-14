import { useParams } from "react-router-dom"
import Navbar from "../components/Navbar"

const Trip = () => {
    const { id } = useParams()
    return (
        <div>
            <Navbar />
            {id}
        </div>
    )
}

export default Trip