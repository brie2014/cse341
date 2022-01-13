const path = require('path')
const express = require('express')

const router = express.Router()


router.use('/user', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'user-info.html'))
})


module.exports = router