import express from 'express'
import asyncHandler from 'express-async-handler'
import { getTripById, createTrip, getTripByUid, deleteTripById } from '../controllers/tripController'

const tripRouter = express.Router()

tripRouter.get('/:id', asyncHandler(getTripById))
tripRouter.get('/', asyncHandler(getTripByUid))
tripRouter.post('/', asyncHandler(createTrip))
tripRouter.delete('/:id', asyncHandler(deleteTripById))

export default tripRouter
