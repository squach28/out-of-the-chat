import { useState } from "react"
import { LoginCredential } from "../types/LoginCredential"
import validator from "validator"
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { Box, Button, TextField, Typography } from "@mui/material"
import GoogleIcon from '@mui/icons-material/Google'


const LoginForm = () => {
    const [loginCredential, setLoginCredential] = useState<LoginCredential>({
        data: {
            email: '',
            password: ''
        },
        errors: {
            email: '',
            password: ''
        }

    })
    const [loading, setLoading] = useState<boolean>(false)
    const auth = getAuth()
    const navigate = useNavigate()

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginCredential({
            ...loginCredential,
            data: {
                ...loginCredential.data,
                [e.target.name]: e.target.value
            },
            errors: {
                ...loginCredential.errors,
                [e.target.name]: ''
            }
        })
    }

    const onInputBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | undefined>) => {
        const inputName = e.target.name 
        const inputValue = e.target.value 
        if(validator.isEmpty(inputValue)) {
            setLoginCredential({
                ...loginCredential,
                errors: {
                    ...loginCredential.errors,
                    [inputName]: `Field is required`
                }
            })
        } else if(inputName === 'email' && !validator.isEmail(inputValue)) {
            setLoginCredential({
                ...loginCredential,
                errors: {
                    ...loginCredential.errors,
                    [inputName]: `Email is not valid`
                }
            })       
        }
    }

    const isUserVerified = async (email: string): Promise<boolean> => {
        try {
            const verified = await fetch(`${import.meta.env.VITE_API_URL}/auth/userVerified?email=${email}`)
            const data = await verified.json()
            return data.verified
        } catch(e) {
            console.log(e)
            return false
        }
    }

    const login = async (loginCredential: LoginCredential) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, loginCredential.data.email, loginCredential.data.password)
            return userCredential.user
        } catch(e) {
            return null
        }
    }

    const validateLogin = (login: LoginCredential) => {
        if(validator.isEmpty(login.data.email) || validator.isEmpty(login.data.password)) {
            return false
        }
        if(!validator.isEmail(login.data.email)) {
            return false
        }
        return true
    }

    const onLoginClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            if(validateLogin(loginCredential)) {
                const verified = await isUserVerified(loginCredential.data.email)
                if(verified) {
                    const user = await login(loginCredential)
                    if(user === null) {
                        setLoginCredential(prev => {
                            return {
                                ...prev,
                                errors: {
                                    ...prev.errors,
                                    password: 'Password is incorrect'
                                }
                            }
                        })
                    } else {
                        navigate('/', { replace: true })
                    }
                } else {
                    setLoginCredential(prev => {
                        return {
                            ...prev,
                            errors: {
                                ...prev.errors,
                                email: 'Email is not verified, check your email for a verification link.'
                            }
                        }
                    })
                }

            }
        } catch(e) {
            console.log(e)
        } finally {
            setLoading(false)
        }

    }

    const onGoogleLoginClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const provider = new GoogleAuthProvider()
        try {
            const result = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(result)
            if(credential !== null) {
                const user = result.user
                console.log(user)
                navigate('/', { replace: true })
            }

        } catch(e) {
            console.log(e)
        }
    }

    return (
        <form className="flex flex-1 flex-col p-4 gap-4 mt-8 md:min-w-[550px] md:p-8 md:mx-auto md:shadow-md md:rounded-lg md:border">
            <h1 className="text-3xl font-bold my-2">Login</h1>
            <TextField
                id="email"
                name="email"
                type="email"
                variant="outlined"
                label="Email"
                onChange={onInputChange}
                onBlur={onInputBlur}
                error={loginCredential.errors.email !== ''}
                helperText={loginCredential.errors.email}
            />
            <TextField 
                id="password"
                name="password"
                type="password"
                variant="outlined"
                label="Password"
                onChange={onInputChange}
                onBlur={onInputBlur}
                error={loginCredential.errors.password !== ''}
                helperText={loginCredential.errors.password}
            />
            <Button
                variant="contained"
                color='primary'
                disabled={loading || !validateLogin(loginCredential)}
                onClick={onLoginClick}
                sx={{ p: 1.25, fontWeight: "bold" }}
            >
                {loading ? 'Loading...' : 'Login'}
            </Button>
            <div className="flex justify-between">
                <Link to="/forgotPassword" className="text-end">Forgot password?</Link>
                <Link to="/signup" replace={true} className="">Sign Up</Link>
            </div>
            <p className="text-center mt-4">Or, continue with</p>
            <Button
                variant="contained"
                color="info"
                onClick={onGoogleLoginClick}
            >
                <Box
                    sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, p: 0.5 }}
                >
                    <GoogleIcon />
                    <Typography
                        variant="body1"
                        component="p"
                        sx={{ fontWeight: "bold"}}
                    >
                        Google
                    </Typography>
                </Box>
            </Button>
        </form>
    )
}

export default LoginForm