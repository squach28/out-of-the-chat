import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import React, { useEffect, useState } from "react"
import { UserSettings } from "../types/UserSettings"

const SettingsForm = () => {
    const [user, setUser] = useState<User | null>(null)
    const [photo, setPhoto] = useState<string>('')
    const [changes, setChanges] = useState<UserSettings>({
        firstName: '',
        lastName: '',
        email: ''
    })

    useEffect(() => {
        const auth = getAuth()
        console.log(auth.currentUser)
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
                console.log(user.displayName!.split(' ')[1])
                setChanges({
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
                fetch(`${import.meta.env.VITE_API_URL}/users/${user.uid}/profilePicture`, {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then(() => {
                        user.reload()
                            .then(() => setPhoto(file.name))
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

    return (
        user ? 
            <form className="flex flex-col gap-2 mt-8">
                <div className="relative w-24 h-24 overflow-hidden rounded-full mx-auto mb-4 hover:cursor-pointer border">
                    <input className="w-full h-full absolute opacity-0 bg-gray-200 rounded-full text-gray-400 hover:cursor-pointer" name="profilePicture" type="file" accept="image/*" onChange={onFileChange} />
                    <img className="w-24 h-24 mx-auto opacity-1 rounded-full hover:cursor-pointer" src={user.photoURL ?? ''} alt="" />
                </div>
                <label htmlFor="firstName">First Name</label>
                <input className="border p-1" id="firstName" name="firstName" type="text" placeholder="First Name" onChange={onChange} value={changes.firstName ?? ''} />
                <label htmlFor="lastName">Last Name</label>
                <input className="border p-1" id="lastName" name="lastName" type="text" placeholder="Last Name" onChange={onChange} value={changes.lastName ?? ''} />
                <label htmlFor="email">Email</label>
                <input className="border p-1" id="email" name="email" type="email" placeholder="First Name" onChange={onChange} value={changes.email ?? ''} />
                <button className="font-bold rounded-md shadow-md px-1 py-2 my-2 bg-button-light text-button-text-light">Save Changes</button>
            </form>
        :
            null
        
    )
}

export default SettingsForm