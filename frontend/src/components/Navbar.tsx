import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null)
    const auth = getAuth()
    const location = useLocation()
    const pathName = location.pathname
    const pathsToHideLogin = [ '/signup', '/login', '/forgotPassword']

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
            }
        })
    }, [auth])
    return (
        <nav className="w-full bg-[#d1d1e9] text-headline-light p-4">
            <ul className="flex justify-between">
                <li className="font-bold text-xl"><Link to="/">Out of the Chat</Link></li>
                {pathsToHideLogin.includes(pathName) ? null : <li>{ user ? <img className="w-7 h-7 rounded-full" src={user?.photoURL ?? ''} alt="" /> : <Link to="/login">Login</Link>}</li>}
            </ul>
        </nav>
    )
}

export default Navbar