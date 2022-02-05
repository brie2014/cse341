//TA05 PLACEHOLDER
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    if (!req.session.counter) {
        req.session.counter = 0
    }
    if (!req.session.color) {
        req.session.color = "#0065bd"
    }
    res.render('pages/ta05', {
        title: 'Team Activity 05',
        path: '/ta05', // For pug, EJS
        counterValue: req.session.counter,
        color: req.session.color,
    });
});

router.post('/change-style', (req, res, next) => {
    const colorValue = req.body.color
    req.session.color = colorValue
    res.redirect('/ta05')
});

router.post('/counter', (req, res, next) => {
    const counterCommand = req.body.counterCommand
    if (counterCommand === "increment") {
        req.session.counter = req.session.counter + 1
    } else if (counterCommand === "decrement") {
        req.session.counter = req.session.counter - 1
    } else {
        req.session.counter = 0
    }
    res.redirect('/ta05')
});

router.post('/reset', (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/ta05')
    })
});





module.exports = router;