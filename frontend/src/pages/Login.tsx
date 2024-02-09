import { Link } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import Navbar from "../components/Navbar"

const Login = () => {
    return (
        <div className="flex flex-col">
            <Navbar />
            <LoginForm />
            <p className="text-center">Don't have an account? <Link to="/signup" replace={true} className="font-bold">Sign Up</Link></p>
         </div>
    )
}

export default Login