const express= require('express');
const router = express.Router();
const User = require('../models/user');
const wrapperfunc = require('../utils/wrapperfunc');
const passport = require('passport');
const usercont = require('../controller/usercontroller')

router.route('/register')
        .get(usercont.userreg)
        .post(wrapperfunc(usercont.userregfunc ))

router.route('/login')
        .get(usercont.userlogin)
        .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), usercont.userloginfunc)




router.get('/logout', usercont.logout)
module.exports= router