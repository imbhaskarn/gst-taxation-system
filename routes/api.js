const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const checkForm = require('../middlewares/validateRequest')
const isLoggedIn = require('../middlewares/Auth')
const {
    createOne,
    viewAll,
    viewOne,
    reviewOne,
    deleteReturn,
    payReturn,
    createDue
} = require('../controllers/taxController')
const {
    isBasic,
    isAdmin,
    isAdminOrAccountant,
    isAccountant
} = require('../roles')
router.get('/', (req, res) => {
    res.json({
        message: "Api is ready!",
        status: 200
    })
})

router.post('/signup', checkForm.signUp, userController.signUp)
router.post('/signin', checkForm.signIn, userController.signIn)
router.get('/homepage', isLoggedIn, (req, res) => {
    res.json({
        msg: "you are on homepage"
    })
})

// database action for api management
router.post('/new', isLoggedIn, isBasic, createOne)
router.get('/all', isLoggedIn, viewAll)

router.get('/one/:id', isLoggedIn, viewOne)

router.post('/review/:id', isLoggedIn, isAdminOrAccountant, reviewOne)

router.get('/pay:id', isLoggedIn, isBasic, payReturn)

router.get('/delete/:id', isLoggedIn, isAdminOrAccountant, deleteReturn)

router.post('/createdue', isLoggedIn, isAccountant, createDue)
router.get('/payreturn/:id', isLoggedIn, isBasic, payReturn)

router.get('/delete/user/:id', isLoggedIn, isAdmin, userController.deleteUser)
router.get('/users', isLoggedIn, isAdmin, userController.allUsers)

module.exports = router