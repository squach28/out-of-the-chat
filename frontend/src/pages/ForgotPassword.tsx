import { Link } from "react-router-dom"
import { useState } from "react"
import validator from "validator"
import verifyEmailImg from '../assets/images/verifyEmail.svg'

const ForgotPassword = () => {

    const [email, setEmail] = useState<string>('')
    const [loading, setLoading] = useState<boolean>()
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false)

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const validateEmail = (email: string) => {
        return validator.isEmail(email)
    }

    const resetPassword = async (email: string) => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/resetPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
            if('email' in resetPasswordResult) {
                setSuccess(true)
            } else {
                setError(resetPasswordResult.message)
            }
        } catch(e) {
            console.log(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {success ?
                <div className="flex flex-col justify-center items-center gap-2 p-4 mt-8">
                    <p className="text-4xl font-bold text-center">Success!</p>
                    <img width={250} height={250} src={verifyEmailImg} alt="" />
                    <p className="text-xl text-center">Check your email on instructions to reset your password.</p>
                    <Link className="text-lg font-bold underline" to="/login" replace={true}>Back to login</Link>
                </div> 
                :
                <form className="flex flex-col p-4 gap-2">
                    <h1 className="text-3xl font-bold">Forgot Password?</h1>
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
            }
            {success ?            
                <footer>
                    <a className="absolute bottom-5 right-5" href="https://storyset.com/internet">Internet illustrations by Storyset</a>
                </footer>
                :
                null
            }
        </div>
    )
}

export default ForgotPassword