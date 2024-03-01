import express from 'express'
import asyncHandler from 'express-async-handler'
import { getRestaurantsByLocation } from '../controllers/restaurantsController'

const restaurantsRouter = express.Router()

restaurantsRouter.get('/', asyncHandler(getRestaurantsByLocation))

export default restaurantsRouter
