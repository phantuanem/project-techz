<script>
import Nav from '../components/nav.vue'
import Products from '../components/manage-product/products.vue'
import axios from 'axios'

export default {
	name: 'ManageProduct',
    data(){
        return {
            products: [],
            brands: []
        }
    },
    methods: {
        async getProducts(){
            try {
                let response = await axios.get('/admin/manage/products', {
                    params: {
                        slug: this.$route.params.slug
                    }
                })
                this.products = response.data.products
                this.brands = response.data.brands
                this.products.forEach(item => {
                    item.show=true
                })
            }catch(e){
                console.log(e)
            }
        }
    },
    created(){
        document.title = "Quản lý sản phẩm"
        this.getProducts()
    },
    watch: {
        '$route.params': function(){
            this.getProducts()
        }
    },
    components: {
        Nav,
        Products
    }
}
</script>

<template>
    <div class="container">
        <Nav/>
        <Products :products="products" :brands="brands"/>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 12em 1fr;
    grid-gap: 10px;
}
</style>
