import express from 'express'

const PORT = process.env.PORT || 4000
const app = express()

app.get('/', (req, res) => {
    res.send('hello')
})

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})