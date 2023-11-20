const express = require('express')
const router = express.Router()

const pageController = require('../controllers/page.controller')

router.get('/', pageController.home)
router.get('/pages/:slug', pageController.pages)
router.get('/page/:slug/:id', pageController.page)
router.get('/search', pageController.search)
router.get('/product/:id', pageController.product)
router.get('/profile', pageController.profile)
router.get('/logout', pageController.logout)
router.get('/cart', pageController.cart)
router.get('/create-payment', pageController.create_payment)
router.get('/profile/update/address', pageController.updateAddress)
router.get('/profile/update/contact', pageController.updatePhone)
router.get('/cart/delivery-information', pageController.delivery_information)
router.get('/user/update', pageController.updateInfoUser)
router.get('/cancel/order', pageController.cancelOrder)
router.get('/delivered/order', pageController.confirmDelivered)

router.post('/cart/create/order', pageController.createOrder)

module.exports = router