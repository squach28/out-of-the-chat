import { useState } from "react"
import { Registration } from "../types/Registration"

const SignupForm = () => {

    const [registration, setRegistration] = useState<Registration>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegistration({
            ...registration,
            [e.target.name]: e.target.value
        })
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
            <button className="font-bold rounded-md bg-green-200 px-1 py-2 my-2">Sign Up</button>
        </form>
    )
}

export default SignupForm