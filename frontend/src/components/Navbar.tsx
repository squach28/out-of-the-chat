import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null)
    const auth = getAuth()

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
            }
        })
    }, [auth])
    return (
        <nav className="w-full bg-green-200 p-2">
            <ul className="flex justify-between">
                <li className="font-bold"><Link to="/">Out of the Chat</Link></li>
                <li>{ user ? <p>{user.displayName}</p> :<Link to="/login">Login</Link>}</li>
            </ul>
        </nav>
    )
}

export default Navbar