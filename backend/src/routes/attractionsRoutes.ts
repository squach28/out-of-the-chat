import express from 'express'
import asyncHandler from 'express-async-handler'
import { addAttraction } from '../controllers/attractionsController'

const attractionsRouter = express.Router()

// attractionsRouter.get('/:id', asyncHandler(getAttractionById))
attractionsRouter.post('/', asyncHandler(addAttraction))
export default attractionsRouter
