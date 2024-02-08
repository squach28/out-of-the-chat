import Navbar from "../components/Navbar"
import SignupForm from "../components/SignupForm"
import { Link } from "react-router-dom"
const Signup = () => {
  return (
    <div className="flex flex-col">
        <Navbar />
        <SignupForm />
        <p className="text-center">Already have an account? <Link to="/login" replace={true} className="font-bold">Log in</Link></p>
    </div>
  )
}

export default Signup