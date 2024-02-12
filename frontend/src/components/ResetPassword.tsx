import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth"
import Navbar from "./Navbar"
import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import validator from "validator"

const ResetPassword = () => {
    const auth = getAuth()
    const [params,] = useSearchParams()
    const [email, setEmail] = useState<string | null>(null)
    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')
    const actionCode = params.get('oobCode')

    const MINIMUM_PASSWORD_LENGTH = 6

    useEffect(() => {
        if(actionCode !== null) {
            verifyPasswordResetCode(auth, actionCode)
                .then((email) => {
                    setEmail(email)
                })
                .catch(err => console.log(err))
        }
    }, [auth, actionCode])

    const validatePasswordFields = () => {
        if(validator.isEmpty(newPassword) || validator.isEmpty(confirmNewPassword)) {
            return false 
        }

        if(newPassword.length < MINIMUM_PASSWORD_LENGTH || confirmNewPassword.length < MINIMUM_PASSWORD_LENGTH) {
            return false
        }

        if(newPassword !== confirmNewPassword) {
            return false
        }

        return true
    }

    const onPasswordResetClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(actionCode !== null) {
            console.log(confirmNewPassword)
            confirmPasswordReset(auth, actionCode, newPassword)
                .then((resp) => {
                    console.log(resp)
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-3xl">Reset Password</h1>
                {email ? <p>Reset your password for {email}</p> : null}
                <form className="flex flex-col gap-2">
                    <label htmlFor="newPassword">New Password</label>
                    <input className="border p-1" id="newPassword" type="password" onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                    <input className="border p-1" id="confirmNewPassword" type="password" onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Confirm New Password" />
                    <button className={`font-bold rounded-md bg-button-light text-white shadow-md px-1 py-2 my-2 ${!validatePasswordFields() ? 'bg-gray-400' : 'bg-button-light'}`} disabled={!validatePasswordFields()} onClick={onPasswordResetClicked}>Reset Password</button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword