const express = require('express')
const {
    check,
    body
} = require('express-validator')

const authController = require('../controllers/auth')
const User = require('../models/user')
const router = express.Router()

router.get('/login', authController.getLogin)
router.post('/login',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .trim(),
        body('password', 'Please enter a password with only numbers, letters, and at least 5 characters.')
        .isLength({
            min: 5
        })
        .isAlphanumeric()
        .trim(),
    ],
    authController.postLogin)

router.get('/logout', authController.getLogout)

router.get('/signup', authController.getSignup)
router.post('/signup',
    [body('name', 'Please enter your name.')
        .isLength({
            min: 5
        })
        .isString()
        .trim(),
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .trim(),
        body('password', 'Please enter a password with only numbers, letters, and at least 5 characters.')
        .isLength({
            min: 5
        })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword').trim().custom((value, {
            req
        }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords have to match.')
            }
            return true
        }),
    ],
    authController.postSignup)

router.get('/reset', authController.getReset)
router.post('/reset', authController.postReset)

router.get('/reset/:token', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)
module.exports = router