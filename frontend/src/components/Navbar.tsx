import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null)
    const auth = getAuth()
    const location = useLocation()
    const pathName = location.pathname
    const pathsToHideLogin = [ '/signup', '/login']

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
                {pathsToHideLogin.includes(pathName) ? null : <li>{ user ? <p>{user.displayName}</p> : <Link to="/login">Login</Link>}</li>}
            </ul>
        </nav>
    )
}

export default Navbar