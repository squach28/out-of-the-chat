import { useState } from "react"
import { Registration } from "../types/Registration"
import validator from 'validator'
import { User, createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { generateErrorMessage } from "../utils/ErrorMessageGenerator"
import { useNavigate } from "react-router-dom"

type SignUpErrors = {
    firstName: string 
    lastName: string
    email: string 
    password: string 
    confirmPassword: string 
}

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
    const [loading, setLoading] = useState(false)
    const auth = getAuth()
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

    // use firebase auth to create a user with email and password
    // after account creation, update user's display name
    // returns the created user
    const signup = async (registration: Registration): Promise<User | FirebaseError | undefined> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, registration.data.email, registration.data.password)
            await updateUserDisplayName(userCredential.user, `${registration.data.firstName} ${registration.data.lastName}`)
            return userCredential.user
        } catch(e) {
            if(e instanceof FirebaseError) {
                return e
            }
        }
    }

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {

        if(validator.isEmpty(e.target.value)) {
            setRegistration({
                ...registration,
                errors: {
                    ...registration.errors,
                    [e.target.name]: `Field is required`
                }
            })
        }
    }

    // use firebase auth to update a user's display name
    const updateUserDisplayName = async (user: User, name: string) => {
        await updateProfile(user, {
            displayName: name
        })
        return
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
        try {
            if(validateRegistration(registration)) {
                const user = await signup(registration)
                if(user instanceof FirebaseError) {
                    console.log(generateErrorMessage(user.code))
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
                {registration.errors.firstName ? <p className="text-red-400 font-bold">Field is required</p> : null}
            </div>
            <input id="firstName" name="firstName" className={`border p-1 ${registration.errors.firstName === '' ? 'border-gray-200' : 'border-red-400'}`} type="text" onBlur={onInputBlur} onChange={onInputChange} placeholder="John" />
            <div className="flex flex-row gap-3">
                <label htmlFor="lastName" className="font-bold">Last Name <span className="text-red-400">*</span></label>
                {registration.errors.lastName ? <p className="text-red-400 font-bold">Field is required</p> : null}
            </div>
            <input id="lastName" name="lastName" className={`border p-1 ${registration.errors.lastName === '' ? 'border-gray-200' : 'border-red-400'}`} type="text" onBlur={onInputBlur} onChange={onInputChange} placeholder="Doe" />
            <div className="flex flex-row gap-3">
                <label htmlFor="email" className="font-bold">Email <span className="text-red-400">*</span></label>
                {registration.errors.email ? <p className="text-red-400 font-bold">Field is required</p> : null}
            </div>
            <input id="email" name="email" className={`border p-1 ${registration.errors.email === '' ? 'border-gray-200' : 'border-red-400'}`} type="email" onBlur={onInputBlur} onChange={onInputChange} placeholder="johndoe@gmail.com" />
            <div className="flex flex-row gap-3">
                <label htmlFor="password" className="font-bold">Password <span className="text-red-400">*</span></label>
                {registration.errors.password ? <p className="text-red-400 font-bold">Field is required</p> : null}
            </div>
            <input id="password" name="password" className={`border p-1 ${registration.errors.password === '' ? 'border-gray-200' : 'border-red-400'}`} type="password" onBlur={onInputBlur} onChange={onInputChange} placeholder="6 characters or longer" />
            <div className="flex flex-row gap-3">
                <label htmlFor="confirmPassword" className="font-bold">Confirm Password <span className="text-red-400">*</span></label>
                {registration.errors.confirmPassword ? <p className="text-red-400 font-bold">Field is required</p> : null}
            </div>
            <input id="confirmPassword" name="confirmPassword" className={`border p-1 ${registration.errors.confirmPassword === '' ? 'border-gray-200' : 'border-red-400'}`} type="password" onBlur={onInputBlur} onChange={onInputChange} placeholder="Must match password" />
            <button className="font-bold rounded-md bg-button-light text-white shadow-md px-1 py-2 my-2" disabled={loading} onClick={onSignupClick}>{loading ? 'Loading...' : 'Sign Up'}</button>
        </form>
    )
}

export default SignupForm