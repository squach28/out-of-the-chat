import express from 'express'
import asyncHandler from 'express-async-handler'
import { getTripById, createTrip } from '../controllers/tripController'

const tripRouter = express.Router()

tripRouter.get('/:id', asyncHandler(getTripById))
tripRouter.post('/', asyncHandler(createTrip))

export default tripRouter
