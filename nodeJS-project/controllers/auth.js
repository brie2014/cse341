const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const User = require('../models/user')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))

exports.getLogin = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message
    })

}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password.')
                return res.redirect('/login');
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
                    req.flash('error', 'Invalid email or password.')
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    req.flash('error', 'Server error. Please try again.')
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/')
    })
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/signup', {
        pageTitle: 'SignUp',
        path: '/signup',
        errorMessage: message
    })

}

exports.postSignup = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match')
        return res.redirect('/signup')
    }
    User.findOne({
            email: email
        }).then(userDoc => {
            if (userDoc) {
                req.flash('error', 'This email is already registered. Please login or use a different email.')
                return res.redirect('/signup')
            }
            return bcrypt
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
                    res.redirect('/login')
                    return transporter.sendMail({
                        to: email,
                        from: 'shop@node-complete.com',
                        html: '<h1>You successfully signed up!</h1>',
                    })

                })
        })

        .catch(err => {
            console.log(err)
        })
}