exports.get404Page = (req, res, next) => {
    res.render('404', {
        pageTitle: 'No Page Found',
        path: '/404',
    })
}