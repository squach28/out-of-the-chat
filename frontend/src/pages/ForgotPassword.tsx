import { Link } from "react-router-dom"
import { useState } from "react"
import validator from "validator"
import verifyEmailImg from '../assets/images/verifyEmail.svg'
import { Button, TextField } from "@mui/material"

type ForgotPasswordFormProps = {
    error: string
    loading: boolean
    onPasswordResetClicked: (e: React.MouseEvent<HTMLButtonElement>, email: string) => void
}

const ForgotPasswordForm = (forgotPasswordFormProps: ForgotPasswordFormProps) => {

    const [email, setEmail] = useState<string>('')

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const validateEmail = (email: string) => {
        return validator.isEmail(email)
    }

    return(
        <form className="flex flex-col p-4 mt-8 gap-4 md:min-w-[550px] md:max-w-lg md:p-8 md:mx-auto md:shadow-md md:rounded-lg md:border">
        <h1 className="text-3xl font-bold">Forgot Password?</h1>
        <h2 className="text-xl">All good, it happens to the best of us</h2>
        <p>Enter your email and we'll send instructions to reset your password.</p>
        <TextField 
            id="email"
            name="email"
            type="email"
            label="Email"
            onChange={onEmailChange}
            error={forgotPasswordFormProps.error !== ''}
            helperText={forgotPasswordFormProps.error}
        />
        <Button
            variant="contained"
            onClick={(e) => forgotPasswordFormProps.onPasswordResetClicked(e, email)}
            disabled={forgotPasswordFormProps.loading || !validateEmail(email)}
            sx={{ p: 1, marginTop: 1 }}
        >
            Reset Password
        </Button>
        <Button
            variant="outlined"
        >
            <Link to="/login" className="text-center" replace={true}>Back to log in</Link>
        </Button>
    </form>        
    )
}

const ForgotPassword = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false)

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

    const onPasswordResetClicked = async (e: React.MouseEvent<HTMLButtonElement>, email: string) => {
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
        <div className="md:mt-24">
            {success ?
                <div className="flex flex-col justify-center items-center gap-2 p-4 mt-8 md:mt-24">
                    <p className="text-4xl font-bold text-center">Success!</p>
                    <img width={250} height={250} src={verifyEmailImg} alt="" />
                    <p className="text-xl text-center">Check your email on instructions to reset your password.</p>
                    <Button
                        variant="outlined"
                        sx={{ marginTop: 2 }}
                    >
                        <Link className="text-lg font-bold p-1" to="/login" replace={true}>Back to login</Link>
                    </Button>
                </div> 
                :
                <ForgotPasswordForm error={error} onPasswordResetClicked={onPasswordResetClicked} loading={loading} />
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