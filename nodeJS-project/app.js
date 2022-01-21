const path = require('path')
const PORT = process.env.PORT || 5000

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

// Use ejs templating
app.set('view engine', 'ejs')
app.set('views', 'views')

const errorController = require ('./controllers/error')

const adminRoutes = (require('./routes/admin'))
const shopRoutes = (require('./routes/shop'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404Page)

app.listen(PORT)