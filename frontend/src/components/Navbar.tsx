import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <nav className="w-full bg-green-200 p-2">
            <ul className="flex justify-between">
                <li className="font-bold"><a href="/">Out of the Chat</a></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar