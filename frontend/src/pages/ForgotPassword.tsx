import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

const ForgotPassword = () => {

    const onPasswordResetClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(e)
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-col p-4 gap-2">
                <h1 className="text-3xl">Forgot Password?</h1>
                <h2 className="text-xl">All good, it happens to the best of us</h2>
                <p>Enter your email and we'll send instructions to reset your password.</p>
                <label className="font-bold" htmlFor="email">Email</label>
                <input id="email" className="border p-1" name="email" type="text" placeholder="Enter your email" />
                <button className={`font-bold rounded-md bg-button-light text-white shadow-md px-1 py-2 my-2`} onClick={onPasswordResetClicked}>Reset password</button>
                <Link to="/login" className="text-center" replace={true}>Back to log in</Link>
            </div>
        </div>
    )
}

export default ForgotPassword