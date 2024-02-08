import { useState } from "react"
import { Registration } from "../types/Registration"
import validator from 'validator'
import { User, createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth"

const SignupForm = () => {

    const [registration, setRegistration] = useState<Registration>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const auth = getAuth()

    // handle any input change in form and update registration object
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegistration({
            ...registration,
            [e.target.name]: e.target.value
        })
    }

    // use firebase auth to create a user with email and password
    // after account creation, update user's display name
    // returns the created user
    const signup = async (registration: Registration) => {
        const userCredential = await createUserWithEmailAndPassword(auth, registration.email, registration.password)
        await updateUserDisplayName(userCredential.user, `${registration.firstName} ${registration.lastName}`)
        return userCredential.user
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
            validator.isEmpty(registration.firstName) || 
            validator.isEmpty(registration.lastName) || 
            validator.isEmpty(registration.email) || 
            validator.isEmpty(registration.password) ||
            validator.isEmpty(registration.confirmPassword)) { // check for empty fields
                return false
        }

        if(!validator.isEmail(registration.email)) { // check for invalid email
            return false
        }

        if(registration.password !== registration.confirmPassword) { // check for mismatching passwords
            return false
        }
        return true
    }

    // handle sign up click
    const onSignupClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setLoading(true)
        if(validateRegistration(registration)) {
            const user = await signup(registration)
            await sendVerificationEmail(user)
        }
    }

    return (
        <form className="flex flex-col p-4 gap-2" action="">
            <h1 className="text-3xl font-bold my-2">Sign Up</h1>
            <label htmlFor="firstName" className="font-bold">First Name</label>
            <input id="firstName" name="firstName" className="border p-1" type="text" onChange={onInputChange} placeholder="John" />
            <label htmlFor="lastName" className="font-bold">Last Name</label>
            <input id="lastName" name="lastName" className="border p-1" type="text" onChange={onInputChange} placeholder="Doe" />
            <label htmlFor="email" className="font-bold">Email</label>
            <input id="email" name="email" className="border p-1" type="email" onChange={onInputChange} placeholder="johndoe@gmail.com" />
            <label htmlFor="password" className="font-bold">Password</label>
            <input id="password" name="password" className="border p-1" type="password" onChange={onInputChange} placeholder="******" />
            <label htmlFor="confirmPassword" className="font-bold">Confirm Password</label>
            <input id="confirmPassword" name="confirmPassword" className="border p-1" type="password" onChange={onInputChange} placeholder="******" />
            <button className="font-bold rounded-md bg-green-200 shadow-md px-1 py-2 my-2" disabled={loading} onClick={onSignupClick}>{loading ? 'Loading...' : 'Sign Up'}</button>
        </form>
    )
}

export default SignupForm