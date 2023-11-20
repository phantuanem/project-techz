const express = require('express')
const router = express.Router()
const passport = require('passport')

const apiController = require('../controllers/api.controller')

router.get('/page/:slug/:id', apiController.page)
router.get('/search', apiController.search)
router.get('/login/success', apiController.loginSuccess)
router.get('/login/fail', apiController.loginFail)
router.get('/cart-item/increase',apiController.increaseQuantityCartItem)
router.get('/cart-item/reduce',apiController.reduceQuantityCartItem)
router.get('/filter', apiController.filterProduct)
router.get('/voucher', apiController.getVoucher)

router.post('/card/add', apiController.addToCard)
router.post('/register', apiController.handleRegister)
router.post('/login', passport.authenticate('local', {
    failureRedirect: "/api/login/fail",
    successRedirect: '/api/login/success'
}))

router.delete('/cart', apiController.removeOrder)

module.exports = router