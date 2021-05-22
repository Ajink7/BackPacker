const User = require('../models/user')


module.exports.renderRegister =  (req,res) => {
    res.render('users/register')
}
module.exports.registerUser = async (req,res) => {
    try{
        const {username , email , password } = req.body
        const user = new User({email ,username})
        const registeredUser = await User.register(user,password)
        //console.log(registeredUser)
        req.login(registeredUser, err => {
            if(err)
            return next(err)
            req.flash('success','Welcome to Yelpcamp!!')
            res.redirect('/campgrounds')
        })
        
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
    
}


module.exports.renderLogin = (req,res) => {
    res.render('users/login')
}
module.exports.loginAuthenticate =  (req,res) => {
    const returnTo = req.session.returnTo || '/campgrounds'
    req.flash('success' , 'Congrats You are now logged in')
    res.redirect(returnTo)
}

module.exports.logoutAuthenticate =  (req,res) => {
    req.logout()
    req.flash('success', 'Goodbye')
    res.redirect('/campgrounds')
}