import express from 'express'
import asyncHandler from 'express-async-handler'
import { getPlaceByText } from '../controllers/placesController'

const placesRouter = express.Router()
placesRouter.get('/', asyncHandler(getPlaceByText))

export default placesRouter
