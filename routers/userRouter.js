const router = require('express').Router()
const { body } = require('express-validator')

const { userController } = require('../controllers')

const { verifyToken } = require('../helper/jwt')

const regisValidation = [
    body('username')
        .notEmpty()
        .withMessage('Username can\'t be empty')
        .isLength({ min: 6 })
        .withMessage('Username must has 6 characters'),
    body('password')
        .notEmpty()
        .withMessage('Password can\'t be empty')
        .isLength({ min: 6 })
        .withMessage('Password must has 6 characters')
        .matches(/[0-9]/)
        .withMessage('Password must include number')
        .matches(/[!@#$%^&*()_]/)
        .withMessage('Password must include symbol'),
    body('email')
        .notEmpty()
        .withMessage('Email can\'t be empty')
        .isEmail()
        .withMessage('Invalid email')    
]

router.post('/register', regisValidation, userController.register)
router.post('/login', userController.login)
router.patch('/deactive', verifyToken, userController.deactive)
router.patch('/activate', verifyToken, userController.reactive)
router.patch('/close', verifyToken, userController.close)

module.exports = router