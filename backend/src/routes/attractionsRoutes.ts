import express from 'express'
import asyncHandler from 'express-async-handler'
import { addAttraction, deleteAttractionById, getAttractionsByTripId, updateAttractionById } from '../controllers/attractionsController'

const attractionsRouter = express.Router()

attractionsRouter.get('/:tripId', asyncHandler(getAttractionsByTripId))
attractionsRouter.post('/', asyncHandler(addAttraction))
attractionsRouter.put('/:attractionId', asyncHandler(updateAttractionById))
attractionsRouter.delete('/:attractionId', asyncHandler(deleteAttractionById))
export default attractionsRouter
