import Navbar from "../components/Navbar"
import SignupForm from "../components/SignupForm"

const Signup = () => {
  return (
    <div className="flex flex-col">
        <Navbar />
        <SignupForm />
        <p className="text-center">Already have an account? <a href="/login" className="font-bold">Log in</a></p>
    </div>
  )
}

export default Signup