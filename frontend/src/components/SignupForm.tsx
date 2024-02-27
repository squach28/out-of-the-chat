import { useState } from "react"
import { Registration } from "../types/Registration"
import validator from 'validator'
import { User } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { useNavigate } from "react-router-dom"
import { Button, TextField } from "@mui/material"

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
            if(data.message) {
                return new FirebaseError(data.code, data.message)
            }
            return data
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
                    [inputName]: `Must be at least 6 characters`
                }
            })
        } else if(inputName === 'confirmPassword' && registration.data.password !== registration.data.confirmPassword) {
            setRegistration({
                ...registration,
                errors: {
                    ...registration.errors,
                    [inputName]: `Passwords must match`
                }
            })
        }
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
                console.log(user)
                if(user instanceof FirebaseError) {
                    setError(user.message)
                    return
                } else {
                    navigate('/login?initialLogin=true', { replace: true})
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
        <form className="flex flex-col p-4 gap-5 mt-8 md:min-w-[550px] md:p-8 md:mx-auto md:shadow-md md:rounded-lg md:border">
            <h1 className="text-3xl font-bold my-2">Sign Up</h1>
            <TextField 
                variant="outlined"
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                onChange={onInputChange}
                onBlur={onInputBlur}
                error={registration.errors.firstName !== ''}
                helperText={registration.errors.firstName}
            />
            <TextField 
                variant="outlined"
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                onChange={onInputChange}
                onBlur={onInputBlur}
                error={registration.errors.lastName !== ''}
                helperText={registration.errors.lastName}
            />
            <TextField 
                variant="outlined"
                id="email"
                name="email"
                type="email"
                label="Email"
                onChange={onInputChange}
                onBlur={onInputBlur}
                error={registration.errors.email !== ''}
                helperText={registration.errors.email}
            />
            <TextField 
                variant="outlined"
                id="password"
                name="password"
                type="password"
                label="Password"
                onChange={onInputChange}
                onBlur={onInputBlur}
                error={registration.errors.password !== ''}
                helperText={registration.errors.password || 'Password must be at least 6 characters'}
            />
            <TextField 
                variant="outlined"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                onChange={onInputChange}
                onBlur={onInputBlur}
                error={registration.errors.confirmPassword !== ''}
                helperText={registration.errors.password || 'Passwords must match'}
            />
            {error ? <p className="text-red-400">{error}</p> : null} 
            <Button
                variant="contained"
                color="primary"
                disabled={loading || !validateRegistration(registration)}
                onClick={onSignupClick}
                sx={{ p: 1 }}
            >
                Sign up
            </Button>
        </form>
    )
}

export default SignupForm