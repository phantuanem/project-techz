<script>
import DetailProduct from './detail-product.vue'
export default {
    name: 'Products',
    props: ['products', 'brands'],
    data() {
        return {
            product_id_select: '',
            brandID: 0,
            input_search: ''
        }
    },
    methods: {
        selectDetailProduct(id) {
            this.product_id_select = id
        }
    },
    components: {
        DetailProduct
    },
    watch: {
        brandID: function(){
            if(this.brandID == 0){
                this.$parent.products.forEach(item => {
                    item.show = true
                })
            } else {
                this.$parent.products.forEach(item => {
                    if(this.brandID == item.brandID){
                        item.show = true
                    } else {
                        item.show = false
                    }
                })
            }
        },
        input_search: function(){
            if(this.input_search.length == 0){
                this.$parent.products.forEach(item => {
                    item.show = true
                })
            } else {
                this.$parent.products.forEach(item => {
                    if(item.name.indexOf(this.input_search) >= 0){
                        item.show = true
                    } else {
                        item.show = false
                    }
                })
            }
        }
    }
}
</script>

<template>
    <div class="box">
        <div class="search">
            <div class="box-search">
                <input type="text" id="input-search" placeholder="Tìm kiếm" v-model="input_search">
                <img src="../../assets/icon/glass_magnifier_magnifying_search_searching_icon.png" alt=""
                    class="img-icon-search">
            </div>
            <div class="box-brand">
                <p>Thương hiệu:</p>
                <select name="" id="" v-model="brandID">
                    <option value="0">Tất cả</option>
                    <option v-for="(brand, i) in brands" :key="i" :value="brand.id">{{ brand.name }}</option>
                </select>
            </div>
        </div>
        <div class="box-table">
            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá niêm yết</th>
                            <th>Giá giảm</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(product, i) in products" :key="i" v-show="product.show">
                            <td>{{ i + 1 }}</td>
                            <td>{{ product.name }}</td>
                            <td>{{ product.quantity }}</td>
                            <td>{{ product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) }}</td>
                            <td>{{ product.sale_price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) }}</td>
                            <td>
                                <div class="td-btn">
                                    <router-link
                                        :to="{ name: 'UpdateProduct', params: { id: product.id } }"><button>Sửa</button></router-link>
                                    <button class="btn-show-detail" @click="selectDetailProduct(product.id)">Chi
                                        tiết</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <DetailProduct :product_id_select="product_id_select" v-if="product_id_select" />
    </div>
</template>

<style scoped>

.box {
    width: calc(100% - 1em);
    height: calc(100% - 1em);
    font-family: "Poppins", Arial, sans-serif;
    display: flex;
    flex-direction: column;
    padding: 0.5em;
    padding-left: 0;
    overflow: hidden;
    font-size: 14px;
}

.box-search {
    height: 3em;
    position: relative;
    display: flex;
    align-items: center;
    width: 40%;
}

.box-table {
    flex: 1;
    position: relative;
}

.table {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    top: 0;
    left: 0;
    font-size: 14px;
}

img.img-icon-search {
    position: absolute;
    height: 1.2em;
    right: 0.5em;
    cursor: pointer;
}

.box-search input#input-search {
    width: calc(100% - 3em);
    padding: 0.7em 1em;
    padding-right: 2em;
    border-radius: 2em;
    outline: none;
    border: 1px solid gray;
    background-color: white;
}

table {
    width: 100%;
}

table th {
    padding: 15px;
    background-color: #9fb09e;
    color: white;
    border: none;
}

table td {
    padding: 8px;
    cursor: pointer;
    border: none;
    text-align: center;
}

tr td:nth-child(2) {
    text-align: left;
}

td button {
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
    border: none;
    background-color: #13aa52;
    color: white;
    border-radius: 3px;
    cursor: pointer;
}

thead th {
    position: sticky;
    top: 0;
}

.td-btn button.btn-show-detail {
    margin-left: 5px;
    background-color: #0a66c2;
}

tbody tr td:last-child {
    text-align: center;
}

tbody tr:hover {
    background-color: #ebebeb;
}

.table table,
.table th,
.table td {
    border: 0px solid black;
    border-collapse: collapse;
}

tr:nth-child(even) {background-color: #f2f2f2;}

.search {
    display: flex;
    align-content: center;
    flex-direction: row;
    align-items: center;
}

.box-brand {
    display: flex;
    align-items: center;
    margin-left: 1em;
}

.box-brand select {
    padding: 5px 8px;
    margin-left: 0.5em;
    cursor: pointer;
}
</style>
