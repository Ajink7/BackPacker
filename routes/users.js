const express = require('express')
const passport = require('passport')
const user = require('../models/user')
const router = express.Router()
const User = require('../models/user')
const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegister)
    .post( users.registerUser)

router.route('/login')
    .get( users.renderLogin)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),users.loginAuthenticate)

router.get('/logout' ,users.logoutAuthenticate)

module.exports = router
