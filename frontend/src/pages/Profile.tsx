import { Avatar, Backdrop, CircularProgress, Typography } from "@mui/material"
import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"

const Profile = () => {
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
            }
        })
    }, [])
    return (

            user && user.photoURL ? 
                <div className="flex flex-col justify-center items-center gap-2 mt-8">
                    <Avatar 
                        src={user.photoURL}
                        alt="user profile picture"
                        sx={{ width: 100, height: 100 }}
                    />
                    <Typography
                        variant="h4"
                        component="h1"
                    >
                        {user.displayName}
                    </Typography>
                </div>
            :
                <Backdrop
                    open={user === null}
                >
                    <CircularProgress />
                </Backdrop>

    )
}

export default Profile