import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"

const SettingsForm = () => {
    const [user, setUser] = useState<User | null>(null)
    const [photo, setPhoto] = useState<string>('')

    useEffect(() => {
        const auth = getAuth()
        console.log(auth.currentUser)
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
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

    return (
        user ? 
            <form className="flex flex-col gap-2 mt-8">
                <div className="relative w-24 h-24 overflow-hidden rounded-full mx-auto mb-4 hover:cursor-pointer border">
                    <input className="w-full h-full absolute opacity-0 bg-gray-200 rounded-full text-gray-400 hover:cursor-pointer" name="profilePicture" type="file" accept="image/*" onChange={onFileChange} />
                    <img className="w-24 h-24 mx-auto opacity-1 rounded-full hover:cursor-pointer" src={user.photoURL ?? ''} alt="" />
                </div>
                <label htmlFor="firstName">First Name</label>
                <input className="border p-1" id="firstName" type="text" placeholder="First Name" value={user.displayName?.split(' ')[0] ?? ''} />
                <label htmlFor="lastName">Last Name</label>
                <input className="border p-1" id="lastName" type="text" placeholder="Last Name" value={user.displayName?.split(' ')[1] ?? ''} />
                <label htmlFor="email">Email</label>
                <input className="border p-1" id="email" type="email" placeholder="First Name" value={user.email ?? ''} />
                <button className="font-bold rounded-md shadow-md px-1 py-2 my-2 bg-button-light text-button-text-light">Save Changes</button>
            </form>
        :
            null
        
    )
}

export default SettingsForm