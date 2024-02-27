import SignupForm from "../components/SignupForm"
import { Link } from "react-router-dom"
const Signup = () => {
  return (
    <div className="flex flex-col md:mt-24 bg-background-light">
        <SignupForm />
        <p className="text-center mt-6">Already have an account? <Link to="/login" replace={true} className="font-bold">Log in</Link></p>
    </div>
  )
}

export default Signup