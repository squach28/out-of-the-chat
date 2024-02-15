import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"

const SettingsForm = () => {
    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser(user)
            }
        })

    }, [])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            const file = e.target.files[0]
            console.log(file)
        }
    }

    return (
        user && user.photoURL ? 
            <form className="flex flex-col mt-8">
                <div className="relative w-24 h-24 overflow-hidden mx-auto">
                    <input className="w-full h-full absolute opacity-0 bg-gray-200 rounded-full text-gray-400 hover:cursor-pointer" type="file" accept="image/*" onChange={onChange} />
                    <img className="w-24 h-24 mx-auto opacity-1 rounded-full hover:cursor-pointer" src={user.photoURL} alt="" />
                </div>
                {/* <img className="w-24 h-24 rounded-full mx-auto" src={user.photoURL} alt="" onClick={} /> */}
            </form>
        :
            null
        
    )
}

export default SettingsForm