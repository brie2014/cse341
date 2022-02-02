const cors = require('cors')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
const User = require('./models/user')

const PORT = process.env.PORT || 5000
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://brie2014:Ilovebackend@cluster0.gn4ni.mongodb.net/shop?retryWrites=true&w=majority';

const corsOptions = {
    origin: "https://<your_app_name>.herokuapp.com/",
    optionsSuccessStatus: 200
};

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    family: 4
};


const app = express()

// Use ejs templating
app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoutes = (require('./routes/admin'))
const shopRoutes = (require('./routes/shop'))

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    User.findById('61f5d125bf0bcd11267a551d')
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log(err))

})

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use(errorController.get404Page)


mongoose.connect(MONGODB_URL)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Brienna',
                    email: 'brie@email.com',
                    cart: {
                        items: []
                    }
                })
                user.save()
            }
        })
        app.listen(PORT)
    })
    .catch(err => {
        console.log(err)
    })