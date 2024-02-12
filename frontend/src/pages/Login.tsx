import { useSearchParams } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import Navbar from "../components/Navbar"
import Toast from "../components/Toast"
import checkSolidIcon from '../assets/icons/check-solid.svg'

const Login = () => {
    const [searchParams, ] = useSearchParams()
    console.log(searchParams.get('initialLogin'))
    return (
        <div className="flex flex-col">
            {
            searchParams.get('initialLogin') ?
                <div className="w-[90%] absolute bottom-[2%] right-[50%] translate-x-[50%]">
                    <Toast iconImg={checkSolidIcon} title="Success!" content="Check your email to verify account" />
                </div> 
                : 
                null
            }
            <Navbar />
            <LoginForm />
         </div>
    )
}

export default Login