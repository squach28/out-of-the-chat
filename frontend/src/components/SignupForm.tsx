import { useState } from "react"
import { Registration } from "../types/Registration"
import validator from 'validator'
import { User, sendEmailVerification } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { generateErrorMessage } from "../utils/ErrorMessageGenerator"
import { useNavigate } from "react-router-dom"

const MINIMUM_PASSWORD_LENGTH = 6

const SignupForm = () => {

    const [registration, setRegistration] = useState<Registration>({
        data: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        errors: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }

    })
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const navigate = useNavigate()

    // handle any input change in form and update registration object
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegistration({
            ...registration,
            data: {
                ...registration.data,
                [e.target.name]: e.target.value
            },
            errors: {
                ...registration.errors,
                [e.target.name]: ''
            }
        })
    }

    // creates an account with the user's email, password, and name
    // verification email will be sent on successful sign up
    const signup = async (registration: Registration): Promise<User | FirebaseError | undefined> => {
        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL}/auth/createAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registration.data)
            })
            const data = await result.json()
            if(result.ok) {
                console.log('yay')
            } else {
                setError(data.message)
            }
            return undefined
        } catch(e) {
            console.log(e)
        }
    }

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const inputName = e.target.name
        const inputValue = e.target.value
        if(validator.isEmpty(inputValue)) {
            setRegistration({
                ...registration,
                errors: {
                    ...registration.errors,
                    [inputName]: `Field is required`
                }
            })
        } else if(inputName === 'email' && !validator.isEmail(inputValue)) {
            setRegistration({
                ...registration,
                errors: {
                    ...registration.errors,
                    [inputName]: `Email is not valid`
                }
            })
        } else if(inputName === 'password' && inputValue.length < MINIMUM_PASSWORD_LENGTH) {
            setRegistration({
                ...registration,
                errors: {
                    ...registration.errors,
                    [inputName]: `Must be 6 chars or longer`
                }
            })
        } else if(inputName === 'confirmPassword' && registration.data.password !== registration.data.confirmPassword) {
            setRegistration({
                ...registration,
                errors: {
                    ...registration.errors,
                    [inputName]: `Passwords do not match`
                }
            })
        }
    }

    // send a verification email to the user
    const sendVerificationEmail = async (user: User) => {
        await sendEmailVerification(user)
    }

    // validate all fields in registration object
    const validateRegistration = (registration: Registration): boolean => {
        if(
            validator.isEmpty(registration.data.firstName) || 
            validator.isEmpty(registration.data.lastName) || 
            validator.isEmpty(registration.data.email) || 
            validator.isEmpty(registration.data.password) ||
            validator.isEmpty(registration.data.confirmPassword)) { // check for empty fields
                return false
        }

        if(!validator.isEmail(registration.data.email)) { // check for invalid email
            return false
        }

        if(registration.data.password !== registration.data.confirmPassword) { // check for mismatching passwords
            return false
        }
        return true
    }

    // handle sign up click
    const onSignupClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            if(validateRegistration(registration)) {
                const user = await signup(registration)
                if(user instanceof FirebaseError) {
                    setError(generateErrorMessage(user.code))
                    return
                } else {
                    await sendVerificationEmail(user as User)
                    navigate('/', { replace: true})
                    return
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
            <h1 className="text-3xl font-bold my-2">Sign Up</h1>
            <div className="flex flex-row gap-3">
                <label htmlFor="firstName" className="font-bold">First Name <span className="text-red-400">*</span></label>
                {registration.errors.firstName !== '' ? <p className="text-red-400 font-bold">{registration.errors.firstName}</p> : null}
            </div>
            <input id="firstName" name="firstName" className={`border p-1 ${registration.errors.firstName === '' ? 'border-gray-200' : 'border-red-400'}`} type="text" onBlur={onInputBlur} onChange={onInputChange} placeholder="John" />
            <div className="flex flex-row gap-3">
                <label htmlFor="lastName" className="font-bold">Last Name <span className="text-red-400">*</span></label>
                {registration.errors.lastName ? <p className="text-sm text-red-400 font-bold">{registration.errors.lastName}</p> : null}
            </div>
            <input id="lastName" name="lastName" className={`border p-1 ${registration.errors.lastName === '' ? 'border-gray-200' : 'border-red-400'}`} type="text" onBlur={onInputBlur} onChange={onInputChange} placeholder="Doe" />
            <div className="flex flex-row gap-3">
                <label htmlFor="email" className="font-bold">Email <span className="text-red-400">*</span></label>
                {registration.errors.email ? <p className="text-sm text-red-400 font-bold">{registration.errors.email}</p> : null}
            </div>
            <input id="email" name="email" className={`border p-1 ${registration.errors.email === '' ? 'border-gray-200' : 'border-red-400'}`} type="email" onBlur={onInputBlur} onChange={onInputChange} placeholder="johndoe@gmail.com" />
            <div className="flex flex-row gap-3">
                <label htmlFor="password" className="font-bold">Password <span className="text-red-400">*</span></label>
                {registration.errors.password ? <p className="text-sm text-red-400 font-bold">{registration.errors.password}</p> : null}
            </div>
            <input id="password" name="password" className={`border p-1 ${registration.errors.password === '' ? 'border-gray-200' : 'border-red-400'}`} type="password" onBlur={onInputBlur} onChange={onInputChange} placeholder="6 characters or longer" />
            <div className="flex flex-row gap-3">
                <label htmlFor="confirmPassword" className="font-bold">Confirm Password <span className="text-red-400">*</span></label>
                {registration.errors.confirmPassword ? <p className="text-sm text-red-400 font-bold">{registration.errors.confirmPassword}</p> : null}
            </div>
            <input id="confirmPassword" name="confirmPassword" className={`border p-1 ${registration.errors.confirmPassword === '' ? 'border-gray-200' : 'border-red-400'}`} type="password" onBlur={onInputBlur} onChange={onInputChange} placeholder="Must match password" />
            {error ? <p className="text-red-400">{error}</p> : null} 
            <button className={`font-bold rounded-md bg-button-light text-white shadow-md px-1 py-2 my-2 ${!validateRegistration(registration) ? 'bg-gray-300' : 'bg-button-light'}`} disabled={loading || !validateRegistration(registration)} onClick={onSignupClick}>{loading ? 'Loading...' : 'Sign Up'}</button>
        </form>
    )
}

export default SignupForm