import LoginForm from "../components/LoginForm"
import Navbar from "../components/Navbar"

const Login = () => {
    return (
        <div className="flex flex-col">
            <Navbar />
            <LoginForm />
            <p className="text-center">Don't have an account? <a href="/signup" className="font-bold">Sign Up</a></p>
        </div>
    )
}

export default Login