const crypto = require('crypto')

const bcrypt = require('bcryptjs')


const {
    validationResult
} = require('express-validator')

const User = require('../models/user')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


exports.getLogin = (req, res, next) => {
    let errorMessage = req.flash('error')
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0]
    } else {
        errorMessage = null
    }
    let userMessage = req.flash('user-message')
    if (userMessage.length > 0) {
        userMessage = userMessage[0]
    } else {
        userMessage = null
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: errorMessage,
        userMessage: userMessage,
        oldInput: {
            email: '',
            password: '',
        },
        validationErrors: []
    })

}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req)
    console.log(errors.array())
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: errors.array()[0].msg,
            userMessage: '',
            oldInput: {
                email: email,
                password: password,
            },
            validationErrors: errors.array()
        })
    }
    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: 'Invalid email.',
                    userMessage: '',
                    oldInput: {
                        email: email,
                        password: password,
                    },
                    validationErrors: []
                })
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    return res.status(422).render('auth/login', {
                        pageTitle: 'Login',
                        path: '/login',
                        errorMessage: 'Invalid password.',
                        userMessage: '',
                        oldInput: {
                            email: email,
                            password: password,
                        },
                        validationErrors: []
                    })
                })
                .catch(err => {
                    console.log(err);
                    req.flash('error', 'Server error. Please try again.')
                    res.redirect('/login');
                });
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        });
};

exports.getLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/')
    })
}

exports.getSignup = (req, res, next) => {
    let errorMessage = req.flash('error')
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0]
    } else {
        errorMessage = null
    }
    let userMessage = req.flash('user-message')
    if (userMessage.length > 0) {
        userMessage = userMessage[0]
    } else {
        userMessage = null
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: errorMessage,
        userMessage: userMessage,
        oldInput: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationErrors: []
    })

}

exports.postSignup = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                name: name,
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        })
    }
    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                cart: {
                    items: [],
                    totalPrice: 0
                }

            })
            return user.save()

        })
        .then(result => {
            req.flash('user-message', 'Thanks for signing up. Please log in.')
            res.redirect('/login')
            return sgMail.sendMail({
                to: email,
                from: 'shop@node-complete.com',
                html: '<h1>You successfully signed up!</h1>',
            })

        })
        .catch(err => {
            console.error(err)
            const error = new Error(err)
            if (err.code == 11000) {
                req.flash('error', 'A user has already registered with that email.');
                res.redirect('/signup');
                return;
            }
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getReset = (req, res, next) => {
    let errorMessage = req.flash('error')
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0]
    } else {
        errorMessage = null
    }
    let userMessage = req.flash('user-message')
    if (userMessage.length > 0) {
        userMessage = userMessage[0]
    } else {
        userMessage = null
    }
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: errorMessage,
        userMessage: userMessage
    })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            req.flash('error', 'Could not reset password. Please try again.')
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        User.findOne({
                email: req.body.email
            }).then(user => {
                if (!user) {
                    req.flash('error', 'No account with that email found.')
                    return res.redirect('/reset')
                }
                user.resetToken = token
                user.resetTokenExpiration = Date.now() + 3600000
                return user.save()
            })
            .then(result => {
                req.flash('user-message', `Password change request received. Please enter a new password.`)
                return res.redirect(`/reset/${token}`)
                //  sgMail.sendMail({
                //     to: req.body.email,
                //     from: 'shop@node-complete.com',
                //     subject: 'Password Reset',
                //     html: `
                // <p>You requested a password reset.</p>
                // <p>Click this <a href="http://localhost:5000/link/reset/${token}>link</a> to set a new password.</p>
                // `,
                // })
            })
            .catch(err => {
                const error = new Error(err)
                error.httpStatusCode = 500
                return next(error)
            })
    })

}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token
    User.findOne({
            resetToken: token,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        })
        .then(user => {
            let errorMessage = req.flash('error')
            if (errorMessage.length > 0) {
                errorMessage = errorMessage[0]
            } else {
                errorMessage = null
            }
            let userMessage = req.flash('user-message')
            if (userMessage.length > 0) {
                userMessage = userMessage[0]
            } else {
                userMessage = null
            }
            res.render('auth/new-password', {
                pageTitle: 'New Password',
                path: '/new-password',
                errorMessage: errorMessage,
                userMessage: userMessage,
                userId: user._id.toString(),
                passwordToken: token,
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
    let resetUser

    User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: {
                $gt: Date.now()
            },
            _id: userId
        })
        .then(user => {
            resetUser = user
            return bcrypt.hash(newPassword, 12)
        })
        .then(hashedPassword => {
            resetUser.password = hashedPassword
            resetUser.resetToken = undefined
            resetUser.resetTokenExpiration = undefined
            return resetUser.save()
        })
        .then(result => {
            req.flash('user-message', 'Password has been reset. Please login.')
            res.redirect('/login')
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })

}