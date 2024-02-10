import express from 'express'
import { isUserVerified, createAccount, resetPassword } from '../controllers/authController'
import asyncHandler from 'express-async-handler'

const authRouter = express.Router()

authRouter.get('/userVerified', asyncHandler(isUserVerified))
authRouter.post('/createAccount', asyncHandler(createAccount))
authRouter.post('/resetPassword', asyncHandler(resetPassword))

export default authRouter
