import { useState } from "react"
import { LoginCredential } from "../types/LoginCredential"
import validator from "validator"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"


const LoginForm = () => {
    const [loginCredential, setLoginCredential] = useState<LoginCredential>({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState<boolean>(false)
    const auth = getAuth()
    const navigate = useNavigate()

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginCredential({
            ...loginCredential,
            [e.target.name]: e.target.value
        })
    }

    const isUserVerified = async (email: string): Promise<boolean> => {
        try {
            const verified = await fetch(`${import.meta.env.VITE_API_URL}/auth/userVerified?email=${email}`)
            const data = await verified.json()
            return data.verified
        } catch(e) {
            console.log(e)
            return false
        }
    }

    const login = async (loginCredential: LoginCredential) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginCredential.email, loginCredential.password)
            return userCredential.user
        } catch(e) {
            return null
        }
    }

    const validateLogin = (login: LoginCredential) => {
        if(validator.isEmpty(login.email) || validator.isEmpty(login.password)) {
            return false
        }
        if(!validator.isEmail(login.email)) {
            return false
        }
        return true
    }

    const onLoginClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            if(validateLogin(loginCredential)) {
                const verified = await isUserVerified(loginCredential.email)
                if(verified) {
                    const user = await login(loginCredential)
                    if(user === null) {
                        alert('Wrong password')
                    } else {
                        navigate('/', { replace: true })
                    }
                } else {
                    alert('Email not verified')
                }

            }
        } catch(e) {
            console.log(e)
        } finally {
            setLoading(false)
        }

    }
    return (
        <form className="flex flex-col p-4 gap-2" action="">
            <h1 className="text-3xl font-bold my-2">Login</h1>
            <label htmlFor="email" className="font-bold">Email</label>
            <input id="email" name="email" className="border p-1" type="email" onChange={onInputChange} placeholder="johndoe@gmail.com" />
            <label htmlFor="password" className="font-bold">Password</label>
            <input id="password" name="password" className="border p-1" type="password" onChange={onInputChange} placeholder="******"/>
            <button className="font-bold rounded-md bg-green-200 shadow-md px-1 py-2 my-2" onClick={onLoginClick}>{loading ? 'Loading...' : 'Login'}</button>
        </form>
    )
}

export default LoginForm