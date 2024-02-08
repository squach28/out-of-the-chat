import express from 'express'
import { isUserVerified } from '../controllers/authController'
import asyncHandler from 'express-async-handler'

const authRouter = express.Router()

authRouter.get('/userVerified', asyncHandler(isUserVerified))

export default authRouter
