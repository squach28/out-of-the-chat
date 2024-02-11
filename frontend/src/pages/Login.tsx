import { Link } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import Navbar from "../components/Navbar"

const Login = () => {
    return (
        <div className="flex flex-col">
            <Navbar />
            <LoginForm />
            <div className="flex justify-between px-4">
                <Link to="/forgotPassword" className="text-end">Forgot password?</Link>
                <Link to="/signup" replace={true} className="">Sign Up</Link>
            </div>
         </div>
    )
}

export default Login