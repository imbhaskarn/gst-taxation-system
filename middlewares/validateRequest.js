const {
    body,
    check
} = require('express-validator');
const signUp = [
    check('name').isLength({
        min: 6
    }).withMessage('name must be 6 chars long'),
    check('username').isLength({
        min: 6
    }).custom(value => !/\s/.test(value)).withMessage('No empty spaces in username'),
    check('password').isLength({
        min: 6
    }).withMessage('weak password'),
]
const signIn = [
    check('username').isLength({
        min: 6
    }),
    check('password').isLength({
        min: 6
    }),
]

module.exports = {
    signUp,
    signIn
}