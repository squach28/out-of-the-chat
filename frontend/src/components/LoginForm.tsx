import { useState } from "react"
import { LoginCredential } from "../types/LoginCredential"
import validator from "validator"
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import googleIcon from '../assets/icons/googleIcon.svg'


const LoginForm = () => {
    const [loginCredential, setLoginCredential] = useState<LoginCredential>({
        data: {
            email: '',
            password: ''
        },
        errors: {
            email: '',
            password: ''
        }

    })
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const auth = getAuth()
    const navigate = useNavigate()

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginCredential({
            ...loginCredential,
            data: {
                ...loginCredential.data,
                [e.target.name]: e.target.value
            },
            errors: {
                ...loginCredential.errors,
                [e.target.name]: ''
            }
        })
    }

    const onInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = e.target.name 
        const inputValue = e.target.value 
        if(validator.isEmpty(inputValue)) {
            setLoginCredential({
                ...loginCredential,
                errors: {
                    ...loginCredential.errors,
                    [inputName]: `Field is required`
                }
            })
        } else if(inputName === 'email' && !validator.isEmail(inputValue)) {
            setLoginCredential({
                ...loginCredential,
                errors: {
                    ...loginCredential.errors,
                    [inputName]: `Email is not valid`
                }
            })       
        }
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
            const userCredential = await signInWithEmailAndPassword(auth, loginCredential.data.email, loginCredential.data.password)
            return userCredential.user
        } catch(e) {
            return null
        }
    }

    const validateLogin = (login: LoginCredential) => {
        if(validator.isEmpty(login.data.email) || validator.isEmpty(login.data.password)) {
            return false
        }
        if(!validator.isEmail(login.data.email)) {
            return false
        }
        return true
    }

    const onLoginClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            if(validateLogin(loginCredential)) {
                const verified = await isUserVerified(loginCredential.data.email)
                if(verified) {
                    const user = await login(loginCredential)
                    if(user === null) {
                        setError('Password was incorrect')
                    } else {
                        navigate('/', { replace: true })
                    }
                } else {
                   setError('Email is not verified, check your email for a verification link.')
                }

            }
        } catch(e) {
            console.log(e)
        } finally {
            setLoading(false)
        }

    }

    const onGoogleLoginClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const provider = new GoogleAuthProvider()
        try {
            const result = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(result)
            if(credential !== null) {
                const user = result.user
                console.log(user)
                navigate('/', { replace: true })
            }

        } catch(e) {
            console.log(e)
        }
    }

    return (
        <form className="flex flex-col p-4 gap-2" action="">
            <h1 className="text-3xl font-bold my-2">Login</h1>
            <div className="flex flex-row gap-3">
                <label htmlFor="email" className="font-bold">Email</label>
                {loginCredential.errors.email !== '' ? <p className={`text-red-400 font-bold`}>{loginCredential.errors.email}</p> : null}
            </div>
            <input id="email" name="email" className={`border p-1 ${loginCredential.errors.email === '' ? 'border-gray-200' : 'border-red-400'}`} type="email" onBlur={onInputBlur} onChange={onInputChange} placeholder="Email" />
            <div className="flex flex-row gap-3">
                <label htmlFor="password" className="font-bold">Password</label>
                {loginCredential.errors.password !== '' ? <p className="text-red-400 font-bold">{loginCredential.errors.password}</p> : null}
            </div>
            <input id="password" name="password" className={`border p-1 ${loginCredential.errors.password === '' ? 'border-gray-200' : 'border-red-400'}`} type="password" onBlur={onInputBlur} onChange={onInputChange} placeholder="Password"/>
            {error ? <p className="text-red-400">{error}</p> : null}
            <button className={`font-bold rounded-md shadow-md px-1 py-2 my-2 text-button-text-light ${!validateLogin(loginCredential) ? 'bg-gray-400' : 'bg-button-light'}`} disabled={loading || !validateLogin(loginCredential)} onClick={onLoginClick}>{loading ? 'Loading...' : 'Login'}</button>
            <div className="flex justify-between px-4">
                <Link to="/forgotPassword" className="text-end">Forgot password?</Link>
                <Link to="/signup" replace={true} className="">Sign Up</Link>
            </div>
            <p className="text-center mt-4">Or, continue with</p>
            <button className="flex justify-center items-center gap-4 bg-blue-400 text-lg rounded-md shadow-md px-1 py-2 my-2" onClick={onGoogleLoginClick}>
                <img src={googleIcon} alt="" />
                <p className="text-white font-bold">Google</p>
            </button>
        </form>
    )
}

export default LoginForm