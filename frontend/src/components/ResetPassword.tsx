import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth"
import Navbar from "./Navbar"
import { useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"
import validator from "validator"

type ResetPasswordForm = {
    data: {
        newPassword: string
        confirmNewPassword: string 
    }
    errors: {
        newPassword: string
        confirmNewPassword: string 
    }
}

const ResetPassword = () => {
    const auth = getAuth()
    const [params,] = useSearchParams()
    const [email, setEmail] = useState<string | null>(null)
    const [resetPasswordForm ,setResetPasswordForm] = useState<ResetPasswordForm>({
        data: {
            newPassword: '',
            confirmNewPassword: ''
        },
        errors: {
            newPassword: '',
            confirmNewPassword: ''
        }
    })
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
        if(validator.isEmpty(resetPasswordForm.data.newPassword) || validator.isEmpty(resetPasswordForm.data.confirmNewPassword)) {
            return false 
        }

        if(resetPasswordForm.data.newPassword.length < MINIMUM_PASSWORD_LENGTH || resetPasswordForm.data.confirmNewPassword.length < MINIMUM_PASSWORD_LENGTH) {
            return false
        }

        if(resetPasswordForm.data.newPassword !== resetPasswordForm.data.confirmNewPassword) {
            return false
        }

        return true
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResetPasswordForm({
            ...resetPasswordForm,
            data: {
                ...resetPasswordForm.data,
                [e.target.name]: e.target.value
            },
            errors: {
                ...resetPasswordForm.errors,
                [e.target.name]: ''
            }
        })
    }

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const fieldValue = e.target.value 
        if(validator.isEmpty(fieldValue)) {
            setResetPasswordForm({
                ...resetPasswordForm,
                errors: {
                    ...resetPasswordForm.errors,
                    [e.target.name]: 'Field is required'
                }
            })
            return 
        }

        if(fieldValue.length < MINIMUM_PASSWORD_LENGTH) {
            setResetPasswordForm({
                ...resetPasswordForm,
                errors: {
                    ...resetPasswordForm.errors,
                    [e.target.name]: 'Must be at least 6 chars'
                }
            })
            return 
        }

        if(resetPasswordForm.data.newPassword !== resetPasswordForm.data.confirmNewPassword) {
            setResetPasswordForm({
                ...resetPasswordForm,
                errors: {
                    ...resetPasswordForm.errors,
                    confirmNewPassword: 'Passwords must match'
                }
            })
        }
    }

    const onPasswordResetClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(actionCode !== null) {
            confirmPasswordReset(auth, actionCode, resetPasswordForm.data.newPassword)
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
                    <div className="flex gap-2 items-center">
                        <label htmlFor="newPassword">New Password</label>
                        {resetPasswordForm.errors.newPassword ? <p className="text-red-500">{resetPasswordForm.errors.newPassword}</p> : null}
                    </div>
                    <input className="border p-1" id="newPassword" name="newPassword" type="password" onChange={onInputChange} onBlur={onInputBlur} placeholder="New Password" />
                    <div className="flex gap-2 items-center">
                        <label htmlFor="confirmNewPassword">Confirm Password</label>
                        {resetPasswordForm.errors.confirmNewPassword ? <p className="text-red-500">{resetPasswordForm.errors.confirmNewPassword}</p> : null}
                    </div>
                    <input className="border p-1" id="confirmNewPassword" name="confirmNewPassword" type="password" onChange={onInputChange} onBlur={onInputBlur} placeholder="Confirm New Password" />
                    <button className={`font-bold rounded-md bg-button-light text-white shadow-md px-1 py-2 my-2 ${!validatePasswordFields() ? 'bg-gray-400' : 'bg-button-light'}`} disabled={!validatePasswordFields()} onClick={onPasswordResetClicked}>Reset Password</button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword