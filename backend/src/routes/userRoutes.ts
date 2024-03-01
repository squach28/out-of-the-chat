import express from 'express'
import { updateUser, updateProfilePicture } from '../controllers/userController'
import asyncHandler from 'express-async-handler'

const userRouter = express.Router()

userRouter.put('/:uid', asyncHandler(updateUser))
userRouter.post('/:uid/profilePicture', asyncHandler(updateProfilePicture))

export default userRouter
