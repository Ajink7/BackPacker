const express = require('express')
const passport = require('passport')
const user = require('../models/user')
const router = express.Router()
const User = require('../models/user')


router.get('/register' , (req,res) => {
    res.render('users/register')
})

router.post('/register', async (req,res) => {
    try{
        const {username , email , password } = req.body
        const user = new User({email ,username})
        const registeredUser = await User.register(user,password)
        console.log(registeredUser)
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
    
})


router.get('/login' , (req,res) => {
    res.render('users/login')
})

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}), (req,res) => {
    const returnTo = req.session.returnTo || '/campgrounds'
    req.flash('success' , 'Congrats You are now logged in')
    res.redirect(returnTo)
})

router.get('/logout' , (req,res) => {
    req.logout()
    req.flash('success', 'Goodbye')
    res.redirect('/campgrounds')
})

module.exports = router
