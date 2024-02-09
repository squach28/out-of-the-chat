import express from 'express'
import admin from 'firebase-admin'
import type { ServiceAccount } from 'firebase-admin'
import serviceAccount from '../config/serviceAccountKey.json'
import authRouter from './routes/authRoutes'
import cors from 'cors'
import bodyParser from 'body-parser'

const PORT = process.env.PORT ?? 4000
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.send('hello')
})

app.listen(PORT, () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
  })
  console.log(`Listening on ${PORT}`)
})
