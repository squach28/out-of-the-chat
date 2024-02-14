import express from 'express'
import asyncHandler from 'express-async-handler'
import { getTripById, createTrip, getTripByUid } from '../controllers/tripController'

const tripRouter = express.Router()

tripRouter.get('/:id', asyncHandler(getTripById))
tripRouter.get('/', asyncHandler(getTripByUid))
tripRouter.post('/', asyncHandler(createTrip))

export default tripRouter
