import { useSearchParams } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import Toast from "../components/Toast"
import checkSolidIcon from '../assets/icons/check-solid.svg'

const Login = () => {
    const [searchParams, ] = useSearchParams()
    return (
        <div className="flex flex-col md:mt-24">
            {
            searchParams.get('initialLogin') ?
                <div className="w-[90%] absolute bottom-[2%] right-[50%] translate-x-[50%]">
                    <Toast iconImg={checkSolidIcon} title="Success!" content="Check your email to verify account" />
                </div> 
                : 
                null
            }
            {
                searchParams.get('logOut') ?
                <div className="w-[90%] absolute bottom-[2%] right-[50%] translate-x-[50%]">
                    <Toast iconImg={checkSolidIcon} title="Success!" content="Log out successful" />
                </div> 
                : 
                null                    
            }
            <LoginForm />
         </div>
    )
}

export default Login