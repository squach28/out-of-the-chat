import LoginForm from "../components/LoginForm"
import Navbar from "../components/Navbar"

const Login = () => {
    return (
        <div className="flex flex-col">
            <Navbar />
            <LoginForm />
         </div>
    )
}

export default Login