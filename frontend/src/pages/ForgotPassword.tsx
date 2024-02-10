import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useState } from "react"
import validator from "validator"

const ForgotPassword = () => {

    const [email, setEmail] = useState<string>('')
    const [loading, setLoading] = useState<boolean>()
    const [error, setError] = useState<string>('')

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const validateEmail = (email: string) => {
        return validator.isEmail(email)
    }

    const resetPassword = async (email: string) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/resetPassword`, {
            method: 'POST',
            body: JSON.stringify({email: email})
        })
        const data = await res.json()
        return data
    }

    const onPasswordResetClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(!validateEmail(email)) {
            setError('Email is not valid')
            return 
        }
        try {
            setLoading(true)
            setError('')
            const resetPasswordResult = await resetPassword(email)
            console.log(resetPasswordResult)
        } catch(e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Navbar />
            <form className="flex flex-col p-4 gap-2">
                <h1 className="text-3xl">Forgot Password?</h1>
                <h2 className="text-xl">All good, it happens to the best of us</h2>
                <p>Enter your email and we'll send instructions to reset your password.</p>
                <div className="flex gap-2">
                    <label className="font-bold" htmlFor="email">Email</label>
                    {error ? <p className="text-red-500">{error}</p> : null}
                </div>
                <input id="email" className="border p-1" name="email" type="text" placeholder="Enter your email" onChange={onEmailChange} />
                <button className={`font-bold rounded-md bg-button-light text-white shadow-md px-1 py-2 my-2`} onClick={onPasswordResetClicked}>{loading ? 'Loading...' : 'Reset password'}</button>
                <Link to="/login" className="text-center" replace={true}>Back to log in</Link>
            </form>
        </div>
    )
}

export default ForgotPassword