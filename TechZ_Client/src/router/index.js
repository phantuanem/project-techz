import { createRouter, createWebHistory } from "vue-router";

import store from '../store'
import axios from 'axios'

import home from '../views/home.vue'
import manage_order from '../views/manage-order.vue'
import manage_product from '../views/manage-product.vue'
import manage_brand from '../views/manage-brand.vue'
import upload_product from '../views/upload-product.vue'
import login from '../views/login.vue'
import manage_employee from '../views/manage-employee.vue'
import employee from '../components/manage-employee/employee.vue'
import add_employee from '../components/manage-employee/add-employee.vue'
import update_employee from '../components/manage-employee/update-employee.vue'
import manage_customer from '../views/manage-customer.vue'
import update_product from '../views/update-product.vue'
import manage_category from '../views/manage-category.vue'
import manage_voucher from '../views/manage-voucher.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: home
    },
    {
        path: '/order',
        name: 'Order',
        component: manage_order
    },
    {
        path: '/voucher',
        name: 'Voucher',
        component: manage_voucher
    },
    {
        path: '/brand',
        name: 'Brand',
        component: manage_brand
    },
    {
        path: '/category',
        name: 'Category',
        component: manage_category
    },
    {
        path: '/manage/:slug',
        name: 'ManageProduct',
        component: manage_product
    },
    {
        path: '/upload/:slug',
        name: 'UploadProduct',
        component: upload_product
    },
    {
        path: '/update/:id',
        name: 'UpdateProduct',
        component: update_product
    },
    {
        path: '/login',
        name: 'Login',
        component: login
    },
    {
        path: '/employee',
        component: manage_employee,
        children: [
            {
                path: '',
                name: 'Employee',
                component: employee
            },
            {
                path: 'add',
                name: 'AddEmployee',
                component: add_employee
            },
            {
                path: 'update/:accountID',
                name: 'UpdateInfoEmployee',
                component: update_employee
            }
        ],
        beforeEnter: (to, from, next) => {
            if (store.state.user.role != 2) {
                next({ name: 'Home' })
            }
            next()
        }
    },
    {
        path: '/customer',
        name: 'ManageCustomer',
        component: manage_customer
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    var token = $cookies.get('token')
    if (token) {
        if (to.path != '/login') {
            let response = await axios.get('/admin/login', { params: { token: token } })
            if (response.data) {
                store.commit('user/updateUser', response.data)
            } else {
                next('/login')
            }
        } else {
            next('/')
        }
    } else if (to.path != '/login') {
        next('/login')
    }
    let result = await axios.get('/admin/category-and-brand')
    store.commit('nav/updateCategory', { category: result.data.category, brands: result.data.brands })
    next()
})

export default router