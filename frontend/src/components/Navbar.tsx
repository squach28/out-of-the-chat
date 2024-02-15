import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"



const ExtendedMenu = () => {

    const auth = getAuth()
    const navigate = useNavigate()
    const logOut = () => {
        try {
            auth.signOut()
                .then(() => {
                    navigate('/login?logOut=success', { replace: true })
                })
        } catch(e) {
            console.log(e)
        }
    }

    return(
        <ul className="absolute w-full left-0 top-[100%] p-2 text-center bg-gray-500">
            <li className="w-full">
                <Link className="w-full block" to={`/trips`}>Trips</Link>
            </li>
            <li className="w-full">
                <Link className="w-full block" to={`/settings`}>Settings</Link>
            </li>
            <li className="w-full">
                <button className="w-full block" onClick={logOut}>Log out</button>
            </li>
        </ul>
    )
}

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null)
    const auth = getAuth()
    const location = useLocation()
    const pathName = location.pathname
    const pathsToHideLogin = [ '/signup', '/login', '/forgotPassword', '/settings']
    const [showExtendedMenu, setShowExtendedMenu] = useState<boolean>(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
            }
        })
    }, [auth])

    const onProfileClicked = () => {
        setShowExtendedMenu(prev => !prev)
    }

    return (
        <nav className="w-full bg-navbar-light text-navbar-text-light p-4 relative">
            <ul className="flex justify-between relative">
                <li className="font-bold text-xl"><Link to="/">Out of the Chat</Link></li>
                <div className="flex gap-4">
                    <li className="hidden">Trips</li>
                    {pathsToHideLogin.includes(pathName) ? null : <li className="hover:cursor-pointer" onClick={onProfileClicked}>{user && user.photoURL ? <img className="w-7 h-7 rounded-full" src={user.photoURL} alt="user profile picture" referrerPolicy="no-referrer" /> : <Link to="/login">Login</Link>}</li>}
                </div>
            </ul>
            {showExtendedMenu && user ? <ExtendedMenu /> : null}
        </nav>
    )
}

export default Navbar