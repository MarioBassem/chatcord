const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureNotAuthenticated} = require('../config/auth');

//Login
router.get('/login', ensureNotAuthenticated, (req, res) => {
    res.render('login')
});

//Register
router.get('/register', ensureNotAuthenticated, (req, res) => {
    res.render('register')
});

//Register handle
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    const errors = [];
    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields.'});
    }

    if(password !== password2){
        errors.push({msg: 'Passwords do not match'});
    }

    if(password.length < 6){
        errors.push({msg: 'Password length should be at least 6 characters'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors,
            name, 
        });
    }else{
        //Validation passed
        User.findOne({where: {email: email}}).then(user => {
            if(user){
                //User Exists
                errors.push({msg: 'Email already exists.'});
                res.render('register', {
                    errors,
                    name,
                    email
                });
            }else{
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if(err) throw err;
                        
                        User.create({
                            name,
                            email,
                            hashed_password: hash,
                        }).then(newUser => {
                            req.flash('success_msg', 'You are now registered.');
                            res.redirect('login');
                        }).catch(err => {
                            console.log(err);
                        })
                    })
                })
                

            }
        })
    }
});

//Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;