exports.get404Page = (req, res, next) => {
    res.render('404', {
        pageTitle: 'No Page Found',
        path: '/404',
        isAuthenticated: req.session.isLoggedIn,
    })
}

exports.get500Page = (req, res, next) => {
    res.render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn,
    })
}