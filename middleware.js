module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl
        req.flash('error','You must Login first!')
        return res.redirect('/login')
    }
    next()
}

