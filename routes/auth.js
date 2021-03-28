const { request } = require('express');
const express = require('express');
const { check,body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login'
    // [
    //     body('email')
    //         .isEmail()
    //         .withMessage('please enter a valid email address.')
    //         .normalizeEmail(),
    //     body('password','Password has to be valid.')
    //         .isLength({ min: 5})
    //         .isAlphanumeric()
    //         .trim()
    // ]
    , authController.postLogin);

router.post('/signup', 
    [
        check('email')
        .isEmail()
        .withMessage('please enter a valid email.')
        .normalizeEmail()
        .custom((value, { req }) => {
        // if( value === 'khadeeja@gmail.com'){
        //     throw new Error('This email address is forbidden');
        // }
        // return true;
        return User.findOne({ email: value})
        .then(userDoc => {
          if( userDoc ) {
              return Promise.reject('error','user already exists, Pick another one')
              }
            });
        }),
        body(
            'password',
            'Please enter a password with only numbers and text with min 5 letters.'
        )
        .isLength({ min: 5})
        .isAlphanumeric()
        .trim(),
        body('confirmPassword').custom((value, { req }) => {
                if ( value !== req.body.password){
                    console.log(value);
                    console.log('password'+ req.body.password);
                    console.log('confirmpassword'+req.body.confirmPassword);

                    throw new Error('Passwords have to match');
                }
                return true;
            })

        
        ],
     authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);


module.exports = router;