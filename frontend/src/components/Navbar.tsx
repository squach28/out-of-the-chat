import { Avatar, Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import PersonIcon from '@mui/icons-material/Person'
import LocalAirportIcon from '@mui/icons-material/LocalAirport'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'

type DrawerListProps = {
    toggleDrawer: (newOpen: boolean) => void
}

const DrawerList = (drawerListProps: DrawerListProps) => {
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
    const items = [
        {
            name: 'Profile',
            icon: <PersonIcon />,
            onClick: () => {
                drawerListProps.toggleDrawer(false)
                navigate('/profile')
            }
        },
        {
            name: 'Trips',
            icon: <LocalAirportIcon />,
            onClick: () => {
                drawerListProps.toggleDrawer(false)
                navigate('/trips')
            }
        },
        {
            name: 'Settings',
            icon: <SettingsIcon />,
            onClick: () => {
                drawerListProps.toggleDrawer(false)
                navigate('/settings')
            }
        },
        {
            name: 'Log out',
            icon: <LogoutIcon />,
            onClick: () => {
                drawerListProps.toggleDrawer(false)
                logOut()
            }
        }
    ]
    // Profile, Trips, settings
    return(
        <Box
            role="presentation"
            sx={{ width: "auto" }}
        >
            <List>
                {items.map(item => (
                    <ListItemButton key={item.name} onClick={item.onClick}>
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    )
}

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null)
    const auth = getAuth()
    const location = useLocation()
    const pathName = location.pathname
    const pathsToHideLogin = [ '/signup', '/login', '/forgotPassword', '/settings']
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
            } else {
                setUser(null)
            }
        })
    }, [auth])

    const toggleDrawer = (newOpen: boolean) => {
        setOpen(newOpen)
    }

    return (
        <nav className="w-full bg-navbar-light text-navbar-text-light p-4 relative shadow-lg">
            <ul className="flex justify-between items-center relative">
                <li className="font-bold text-xl"><Link to="/">Out of the Chat</Link></li>
                <div className="flex gap-4">
                    {pathsToHideLogin.includes(pathName) ? 
                        null 
                    : 
                        <li className="hover:cursor-pointer">
                            {user && user.photoURL ? 
                                <Avatar 
                                    src={user.photoURL} 
                                    alt="user profile picture"
                                    onClick={() => toggleDrawer(true)}
                                /> 
                            : 
                                <Link to="/login">Login</Link>}
                        </li>}
                </div>
            </ul>
            <Drawer
                anchor="top"
                open={open}
                onClose={() => toggleDrawer(false)}
            >
                <DrawerList toggleDrawer={toggleDrawer} />
            </Drawer>
        </nav>
    )
}

export default Navbar