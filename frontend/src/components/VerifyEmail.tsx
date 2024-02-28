import { Link, useSearchParams } from "react-router-dom"
import { applyActionCode, getAuth } from "firebase/auth"
import { useEffect, useState } from "react"
import newMessage from '../assets/images/newMessage.svg'
import missedChance from '../assets/images/missedChance.svg'

enum VerifyEmailResult {
    SUCCESS,
    PENDING,
    FAILED,
    ALREADY_VERIFIED
}

const VerifyEmail = () => {
    const [result, setResult] = useState<VerifyEmailResult>(VerifyEmailResult.PENDING)
    const [params] = useSearchParams()
    const actionCode = params.get('oobCode')

    useEffect(() => { //TODO: need to add a fetch to check if user is already verified so firebase error doesn't occur
        const auth = getAuth()
        if(actionCode !== null) {
            console.log(actionCode)
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
            return (
                    <div>
                    </div>
            )
        case VerifyEmailResult.SUCCESS:
            return(                    
                    <div>
                        <div className="flex flex-col gap-2 text-center p-4 mt-4">
                            <h1 className="text-3xl font-bold">Success!</h1>
                            <img src={newMessage} alt="" />
                            <p className="text-xl">You've verified your email address.</p>
                            <Link className="underline text-lg" to="/login">Click here to log in</Link>
                            <footer className="absolute bottom-1 right-1">
                                <a href="https://storyset.com/communication">Communication illustrations by Storyset</a>
                            </footer>
                        </div>
                    </div>
                )
        case VerifyEmailResult.FAILED:
            return (            
                <div>
                    <div className="flex flex-col gap-2 text-center p-4">
                        <h1 className="text-3xl font-bold">Something went wrong</h1>
                        <img src={missedChance} alt="" />
                        <p className="text-2xl">Email verification failed</p>
                        <p className="text-lg">Please try the link in your email again.</p>
                        <footer className="absolute bottom-1 right-1">
                                <a href="https://storyset.com/communication">Communication illustrations by Storyset</a>
                        </footer>
                    </div>
                </div>
                )
        default:
            return null
    }
}

export default VerifyEmail