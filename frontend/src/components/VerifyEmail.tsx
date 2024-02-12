import { Link, useSearchParams } from "react-router-dom"
import Navbar from "../components/Navbar"
import { applyActionCode, getAuth } from "firebase/auth"
import { useEffect, useState } from "react"

enum VerifyEmailResult {
    SUCCESS,
    PENDING,
    FAILED
}

const VerifyEmail = () => {
    const [result, setResult] = useState<VerifyEmailResult>(VerifyEmailResult.PENDING)
    const [params] = useSearchParams()
    const actionCode = params.get('oobCode')

    useEffect(() => {
        const auth = getAuth()
        if(actionCode !== null) {
            applyActionCode(auth, actionCode)
                .then(() => {
                    setResult(VerifyEmailResult.SUCCESS)
                })
                .catch(error => {
                    console.log(error)
                    setResult(VerifyEmailResult.FAILED)
                })
        } else {
            console.log('missing action code')
        }

    }, [actionCode])

    switch(result) {
        case VerifyEmailResult.PENDING:
            return null
        case VerifyEmailResult.SUCCESS:
            return(                    
                    <div>
                        <Navbar />
                        <h1>Success!</h1>
                        <p>You've verified your email address.</p>
                        <Link to="/login">Click here to log in</Link>
                    </div>
                )
        case VerifyEmailResult.FAILED:
            return (            
                <div>
                    <Navbar />
                    <p>Something went wrong</p>
                </div>
                )
        default:
            return null
    }
}

export default VerifyEmail