const path = require('path')
const express = require('express')

const app = express()

const userRoutes = (require('./routes/user'))
const mainRoutes = (require('./routes/main'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(userRoutes)
app.use(mainRoutes)

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'error.html'))
})

app.listen(3000)