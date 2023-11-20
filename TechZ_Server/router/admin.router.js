const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin.controller')

router.get('/', adminController.home)
router.get('/dashboard', adminController.dashboard)
router.get('/category-and-brand', adminController.getCtegoryAndBrand)
router.get('/upload/info', adminController.uploadGetInfo)
router.get('/manage/products', adminController.manageGetProducts)
router.get('/employees', adminController.getEmployees)
router.get('/employee', adminController.getEmployee)
router.get('/manage/detail', adminController.getManageDetailProduct)
router.get('/orders', adminController.getOrders)
router.get('/order', adminController.getOrder)
router.get('/customers', adminController.getAllCustomer)
router.get('/login', adminController.authLogin)
router.get('/product', adminController.getProduct)
router.get('/categorys', adminController.getAllCategory)
router.get('/brands', adminController.getAllBrand)
router.get('/voucher', adminController.getAllVoucher)

router.post('/employee/add', adminController.addEmployee)
router.post('/login', adminController.habdleLogin)
router.post('/product/upload', adminController.uploadProduct)
router.post('/category', adminController.addCategory)
router.post('/brand', adminController.addBrand)
router.post('/give/voucher', adminController.giveVoucher)

router.put('/employee', adminController.updateInfoEmployee)
router.put('/order-status', adminController.updateOrderStatus)
router.put('/product', adminController.updateProduct)
router.put('/category', adminController.updateCategory)
router.put('/brand', adminController.updateBrand)
router.put('/voucher', adminController.updateVoucher)

router.delete('/image', adminController.deleteImage)
router.delete('/product', adminController.deleteProduct)
router.delete('/employee', adminController.deleteEmployee)
router.delete('/category', adminController.deleteCategory)
router.delete('/brand', adminController.deleteBrand)
router.delete('/voucher', adminController.deleteVoucher)

module.exports = router