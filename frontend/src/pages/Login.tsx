import { useSearchParams } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import { Alert, Snackbar } from "@mui/material"
import { useState } from "react"

const Login = () => {
    const [searchParams, ] = useSearchParams()
    const [initialLogin, setInitialLogin] = useState<string | null>(searchParams.get('initialLogin'))
    const [logoutSuccess, setLogoutSuccess] = useState<string | null>(searchParams.get('logOut'))

    const handleInitialLoginClose = () => {
        setInitialLogin(null)
    }

    const handleLogoutSuccessClose = () => {
        setLogoutSuccess(null)
    }


    return (
        <div className="flex flex-col md:mt-24">
            {
            initialLogin ?
                <Snackbar 
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={Boolean(initialLogin)}
                    onClose={handleInitialLoginClose}
                >
                    <Alert
                        onClose={handleInitialLoginClose}
                        severity="info"
                        sx={{ width: "100%" }}
                    >
                        Check your email to verify your account.
                    </Alert>
                </Snackbar>
                : 
                null
            }
            {
                logoutSuccess ?
                <Snackbar 
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    open={Boolean(logoutSuccess)}
                    onClose={handleLogoutSuccessClose}
                >
                    <Alert
                        onClose={handleLogoutSuccessClose}
                        severity="success"
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        You have successfully logged out!
                    </Alert>
                </Snackbar>
                : 
                null                    
            }
            <LoginForm />
         </div>
    )
}

export default Login