import express from 'express'
import admin from 'firebase-admin'
import type { ServiceAccount } from 'firebase-admin'
import serviceAccount from '../config/serviceAccountKey.json'
import authRouter from './routes/authRoutes'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import tripRouter from './routes/tripRoutes'
import userRouter from './routes/userRoutes'
import fileUpload from 'express-fileupload'
import placesRouter from './routes/placesRoutes'
import attractionsRouter from './routes/attractionsRoutes'
import feedRouter from './routes/feedRoutes'
import restaurantsRouter from './routes/restaurantsRoutes'
dotenv.config()

const PORT = process.env.PORT ?? 4000
const app = express()

app.use(cors())
app.use(fileUpload())
app.use(bodyParser.json())

app.use('/auth', authRouter)
app.use('/trips', tripRouter)
app.use('/users', userRouter)
app.use('/places', placesRouter)
app.use('/attractions', attractionsRouter)
app.use('/restaurants', restaurantsRouter)
app.use('/feed', feedRouter)

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(PORT, () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  })
  console.log(`Listening on ${PORT}`)
})
