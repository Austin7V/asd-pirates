const express = require('express')
const app = express()
const port = 3002

const Logger = (req, res, next) => {
    console.log("Log it")
    next()
}

app.use(Logger)

app.get('/', (req, res) => {
    res.send('Hello Sssss!')
})
app.get('/about/:username', (req, res) => {
    res.send('About Page! Hello' + req.params.username)})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})