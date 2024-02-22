import express from 'express'
import asyncHandler from 'express-async-handler'
import { getFeedByTripId } from '../controllers/feedController'

const feedRouter = express.Router()

feedRouter.get('/:tripId', asyncHandler(getFeedByTripId))

export default feedRouter
