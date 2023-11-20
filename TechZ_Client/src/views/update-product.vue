<script>
import Nav from '../components/nav.vue'
import axios from 'axios'
export default {
    name: 'Home',
    data() {
        return {
            product: null,
            images: [],
            desc_short: [],
            desc: [],
            categorys: [],
            loading: false
        }
    },
    methods: {
        async getProduct() {
            const response = await axios.get('/admin/product', {
                params: {
                    productID: this.$route.params.id
                }
            })
            this.product = response.data.product
            this.images = response.data.images
            this.desc_short = response.data.desc_short
            this.desc = response.data.desc
            this.categorys = response.data.category
        },
        async update() {
            if (this.product) {
                // this.loading = true
                // const response = await axios.put('/admin/product', {
                //     product: this.product,
                //     desc_short: this.desc_short,
                //     desc: this.desc
                // })
                // this.loading = false
                // window.location.reload()
            }
        },
        async deleteImage(img) {
            // this.loading = true
            // var response = await axios.delete('/admin/image', {
            //     params: {
            //         image: img
            //     }
            // })
            // if (response.data) {
            //     this.images.forEach((item, i) => {
            //         if (img.id == item.id) {
            //             this.images.splice(i, 1)
            //         }
            //     })
            // }
            // this.loading = false
        },
        async deleteProduct() {
            // var response = await axios.delete('/admin/product', {
            //     params: {
            //         productID: this.product.id
            //     }
            // })
            // this.categorys.forEach(ct => {
            //     if (ct.id == this.product.categoryID) {
            //         this.$router.push({ name: 'ManageProduct', params: { slug: ct.slug } })
            //     }
            // })
        },
        back() {
            this.categorys.forEach(ct => {
                if (ct.id == this.product.categoryID) {
                    this.$router.push({ name: 'ManageProduct', params: { slug: ct.slug } })
                }
            })
        }
    },
    created() {
        document.title = "Cập nhật sản phẩm";
        this.getProduct()
    },
    components: {
        Nav
    }
}
</script>

<template>
    <div class="container">
        <Nav />
        <div class="box" v-if="product">
            <p class="title">Chỉnh sủa thông tin sản phẩm</p>
            <button class="btn-back" @click="back">Trở về</button>
            <div class="category-and-brand">
                <h4>Danh mục:</h4>
                <select name="" id="" v-model="product.categoryID">
                    <option value="">Danh mục</option>
                    <option v-for="(cate, i) in categorys" :value="cate.id">{{ cate.name }}</option>
                </select>
                <h4>Nhãn hàng:</h4>
                <select name="" id="" v-model="product.brandID">
                    <option value="">Thương hiệu</option>
                    <option v-for="(brand, i) in $store.state.nav.brands" :value="brand.id">{{ brand.name }}</option>
                </select>
            </div>
            <div class="input-group">
                <label for="">Tên sản phẩm:</label>
                <textarea class="textarea-name-product" v-model="product.name"></textarea>
            </div>
            <div class="group-row">
                <div class="input-group">
                    <label for="">Giá niêm yết:</label>
                    <input type="text" v-model="product.price">
                </div>
                <div class="input-group">
                    <label for="">Giá bán lẻ:</label>
                    <input type="text" v-model="product.sale_price">
                </div>
                <div class="input-group">
                    <label for="">Số lượng trong kho:</label>
                    <input type="text" v-model="product.quantity">
                </div>
                <div class="input-group">
                    <label for="">Thời gian bảo hành(tháng):</label>
                    <input type="text" v-model="product.quarranty_period">
                </div>
            </div>
            <br>
            <h4>Ảnh sản phẩm:</h4>
            <div class="box-images">
                <div class="box-images-item" v-for="(img, i) in images" :key="i">
                    <img src="../assets/icon/wrong_delete_remove_trash_minus_icon.png" alt="" class="img-icon"
                        @click="deleteImage(img)">
                    <img :src="img.url">
                </div>
            </div>
            <h4 class="title-desc">Thông số kỹ thuật</h4>
            <div class="box-grid-desc">
                <div class="input-group" v-for="(de, i) in desc" :key="i">
                    <label for="">{{ de.title }}:</label>
                    <textarea rows="5" v-model="de.content.content"></textarea>
                </div>
            </div>
            <h4 class="title-desc-short">Thông số kỹ thuật ngắn</h4>
            <div class="box-grid-desc-short">
                <div class="input-group" v-for="(de, i) in desc_short" :key="i">
                    <label for="">{{ de.title }}:</label>
                    <textarea rows="5" v-model="de.content"></textarea>
                </div>
            </div>
            <button class="btn-update" @click="update">Lưu</button>
            <button class="btn-delete-product" @click="deleteProduct">Xóa sản phẩm</button>
        </div>
        <div class="loading" v-show="loading">
            <div></div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Roboto&display=swap');

.container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 12em 1fr;
    grid-gap: 1em;
    font-family: 'Roboto', sans-serif;
}

.box {
    position: relative;
    width: calc(100% - 0.5em);
    height: calc(100% - 1em);
    padding-right: 0.5em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    overflow-y: scroll;
}

.box-images {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 1em;
    margin: 1em 0;
}

.box-images img {
    width: 100%;
}

.box-images-item {
    position: relative;
}

.box-images img.img-icon {
    width: 1.5em;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
}

button.btn-update,
button.btn-delete-product {
    font-size: 15px;
    padding: 0.5em 2em;
    cursor: pointer;
    border: 1px solid gray;
    background-color: white;
    margin-top: 0.5em;
    border-radius: 3px;
}

button.btn-delete-product {
    margin-left: 20%;
    background-color: #a75215;
    color: white;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000063;
}

.loading div {
    width: 2em;
    height: 2em;
    border: 5px solid white;
    border-radius: 50%;
    border-top: 5px solid gray;
    animation: spinner 0.5s infinite linear;
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

select {
    padding: 5px;
    margin: 5px 0;
    cursor: pointer;
}

.input-group {
    margin: 8px 0px;
}

.input-group input {
    outline: none;
    display: block;
    padding: 8px;
    font-size: 14px;
    width: calc(100% - 20px);
    border: 1px solid gray;
    border-radius: 3px;
}

p.title {
    margin-bottom: 1em;
    text-align: center;
    text-transform: uppercase;
}

button.btn-back {
    position: absolute;
    top: 0.5em;
    left: 0;
    cursor: pointer;
    padding: 3px 10px;
    background-color: #7272fe;
    border: none;
    border-radius: 3px;
    color: white;
}

textarea.textarea-name-product {
    display: block;
    padding: 1em;
    outline: none;
    border-radius: 0.5em;
    width: calc(100% - 2em - 2px);
    min-height: 3em;
    font-size: 13px;
}

.group-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 1em;
}

.category-and-brand {
    display: flex;
    align-items: center;
}

.category-and-brand select:nth-child(2) {
    margin-right: 2em;
}

.group-row label {
    margin-bottom: 5px;
    display: block;
}

.category-and-brand h4 {
    margin-right: 5px;
}

.box-grid-desc,
.box-grid-desc-short {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1em;
}

.box-grid-desc textarea,
.box-grid-desc-short textarea {
    padding: 1em;
    border-radius: 0.5em;
    width: calc(100% - 2em - 2px);
}

h4.title-desc,
h4.title-desc-short {
    padding: 10px;
    background-color: #e4cac1;
}
</style>
