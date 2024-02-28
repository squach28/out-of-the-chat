import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import React, { useEffect, useState } from "react"
import { UserSettings } from "../types/UserSettings"
import { Alert, Backdrop, Button, CircularProgress, Snackbar, TextField, Typography } from "@mui/material"
import _ from 'lodash'

const SettingsForm = () => {
    const [user, setUser] = useState<User | null>(null)
    const [photo, setPhoto] = useState<string>('')
    const [prevAccount, setPrevAccount] = useState<UserSettings>({
        firstName: '',
        lastName: '',
        email: ''
    })
    const [changes, setChanges] = useState<UserSettings>({
        firstName: '',
        lastName: '',
        email: ''
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean | null>(null)

    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
                setChanges({
                    firstName: user.displayName!.split(' ')[0],
                    lastName: user.displayName!.split(' ')[1],
                    email: user.email!
                })
                setPrevAccount({
                    firstName: user.displayName!.split(' ')[0],
                    lastName: user.displayName!.split(' ')[1],
                    email: user.email!
                })
            }
        })

    }, [photo])

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const file = e.target.files[0]
            if(user) {
                const formData = new FormData()
                formData.append('file', file)
                setLoading(true)
                fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}/profilePicture`, {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then(() => {
                        user.reload()
                            .then(() => setPhoto(file.name))
                            setSuccess(true)
                    })
                    .catch(e => {
                        setSuccess(false)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChanges({
            ...changes,
            [e.target.name]: e.target.value
        })
    }

    const onSnackBarClose = () => {
        setSuccess(null)
    }

    const onSaveChangesClick = () => {
        if(user) {
            setLoading(true)
            const update = {
                displayName: `${changes.firstName} ${changes.lastName}`,
                email: changes.email
            }
            fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(update)
            })
                .then(res => res.json())
                .then(() => {
                    user.reload()
                    setSuccess(true)
                })
                .catch(e => {
                    setSuccess(false)
                })
                .finally(() => {
                    setLoading(false)
                })
        }

    }

    return (
        user ? 
                <form className="flex flex-col gap-8 mt-8 md:min-w-[550px] md:max-w-lg md:p-8 md:mx-auto">
                        <div className="relative w-24 h-24 overflow-hidden rounded-full mx-auto mb-4 hover:cursor-pointer border">
                            <input className="w-full h-full absolute opacity-0 bg-gray-200 rounded-full text-gray-400 hover:cursor-pointer" name="profilePicture" type="file" accept="image/*" onChange={onFileChange} />
                            <img className="w-24 h-24 mx-auto opacity-1 rounded-full hover:cursor-pointer" src={user.photoURL ?? ''} alt="" />
                        </div>
                        <TextField
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            type="text"
                            onChange={onChange}
                            value={changes.firstName}
                        />
                        <TextField
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            type="text"
                            onChange={onChange}
                            value={changes.lastName}
                        />
                        <TextField
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            onChange={onChange}
                            value={changes.email}
                        />
                        <Button
                            variant="contained"
                            disabled={loading || _.isEqual(prevAccount, changes)}
                            onClick={onSaveChangesClick}
                            sx={{ fontWeight: "bold", marginTop: 2, p: 1 }}
                        >
                            Save Changes
                        </Button>
                        <Backdrop open={loading}>
                            <CircularProgress />
                        </Backdrop>
                        <Snackbar
                            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                            autoHideDuration={4000}
                            open={Boolean(success)}
                            onClose={onSnackBarClose}
                        >
                            {success !== null && success ? 
                                <Alert
                                variant="standard"
                                severity="success"
                                sx={{ width: "100%" }}
                                >
                                <Typography
                                    variant="body1"
                                    component="p"
                                >
                                    Your changes were saved!
                                </Typography>
                                </Alert>
                            : 
                                <Alert
                                variant="standard"
                                severity="error"
                                sx={{ width: "100%" }}
                                >
                                <Typography
                                    variant="body1"
                                    component="p"
                                >
                                    Something went wrong, please try again.
                                </Typography>
                                </Alert>
                            }

                        </Snackbar>
                </form>
        :
            null
        
    )
}

export default SettingsForm