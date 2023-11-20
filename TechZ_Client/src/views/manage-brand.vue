<script>
import Nav from '../components/nav.vue'
import axios from 'axios'

export default {
    name: 'ManageBrand',
    data() {
        return {
            brands: [],
            brand_name: '',
            id_brand_delete: 0,
            brand_select: null
        }
    },
    methods: {
        async getAllBrand() {
            var response = await axios.get('/admin/brands')
            this.brands = response.data
        },
        async addBrand() {
            if (this.brand_name.length > 0) {
                var response = await axios.post('/admin/brand', {
                    name: this.brand_name
                })
                if (response.data) {
                    this.brands.push(response.data)
                }
                this.brand_name = ''
            }
        },
        async deleteBrand() {
            if (this.id_brand_delete > 0) {
                var response = await axios.delete('/admin/brand', {
                    params: {
                        id: this.id_brand_delete
                    }
                })
                if (response.data) {
                    this.brands.forEach((brand, i) => {
                        if (brand.id == this.id_brand_delete) {
                            this.brands.splice(i, 1)
                        }
                    })
                }
                this.id_brand_delete = 0
            }
        },
        async updateBrand(){
            if(this.brand_select){
                var response = await axios.put('/admin/brand', {
                    id: this.brand_select.id,
                    name: this.brand_select.name
                })
                if(response.data){
                    this.brands.forEach((brand, i) => {
                        if(brand.id == this.brand_select.id){
                            brand.name = this.brand_select.name
                        }
                    })
                }
                this.brand_select = null
            }
        }
    },
    created() {
        document.title = "Quản lý nhãn hàng";
        this.getAllBrand()
    },
    components: {
        Nav
    }
}
</script>

<template>
    <div class="container">
        <Nav />
        <div class="box">
            <p class="title">Quản lý nhãn hàng</p>
            <div class="row">
                <div class="row-brands">
                    <ul>
                        <li v-for="(brand, i ) in brands" :key="i">
                            <p>{{ brand.name }}</p>
                            <img src="../assets/icon/bxs_edit_alt_icon.png" alt="" class="img-icon icon-edit" @click="() => brand_select = {...brand}">
                            <img src="../assets/icon/wrong_delete_remove_trash_minus_icon.png" alt="" class="img-icon"
                                @click="() => id_brand_delete = brand.id">
                        </li>
                    </ul>
                </div>
                <hr>
                <div class="row-add-brand">
                    <p>Thêm nhãn hàng:</p>
                    <div class="input-brand">
                        <input type="text" v-model="brand_name" placeholder="Tên nhãn hàng">
                        <button @click="addBrand">Thêm</button>
                    </div>
                </div>
            </div>
            <div class="form-confirm-delete" v-if="id_brand_delete > 0">
                <button @click="deleteBrand">Xóa</button><button @click="() => id_brand_delete = 0">Hủy</button>
            </div>
            <div class="form-update-brand" v-if="brand_select">
                <div class="form-update">
                    <p>Cập nhật tên nhãn hàng</p>
                    <input type="text" v-model="brand_select.name">
                    <div class="form-update-btn">
                        <button @click="updateBrand">Cập nhật</button>
                        <button @click="() => brand_select = null">Hủy</button>
                    </div>
                </div>
            </div>
        </div>
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

.box {
    padding: 0.5em;
    padding-left: 0em;
    height: calc(100% - 1em);
    font-family: 'Roboto', sans-serif;
    overflow: hidden;
}

p.title {
    text-transform: uppercase;
    text-align: center;
    height: 2em;
}

.box .row {
    display: flex;
    flex-direction: row;
    height: calc(100% - 2em);
    justify-content: space-evenly;
}

.row-brands ul {
    list-style: none;
}

.row-brands ul li {
    padding: 0.5em 1em;
    cursor: pointer;
    background-color: #ededed;
    margin: 5px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

img.img-icon {
    width: 1.2em;
    cursor: pointer;
    margin-left: 1em;
}

img.img-icon:hover {
    background-color: gold;
}

img.img-icon.icon-edit:hover {
    background-color: #aeaeff;
}

.row-brands ul li p {
    flex-grow: 1;
}

.row-brands {
    height: 100%;
    overflow-y: scroll;
    padding: 0 1em;
}

.input-brand input {
    height: 2em;
    font-size: 14px;
    outline: none;
    border: 1px solid gray;
    padding: 0 0.5em;
    border-radius: 3px;
}

.input-brand button {
    height: 2em;
    background-color: white;
    margin-left: 0.5em;
    padding: 0 1em;
    font-size: 14px;
    border-radius: 3px;
    border: 1px solid gray;
    cursor: pointer;
}

.input-brand {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 0.5em;
}

.form-confirm-delete {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #00000045;
}

.form-confirm-delete button {
    padding: 0.5em 2em;
    background-color: white;
    border: none;
    margin: 0 5px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
}

.form-confirm-delete button:first-child {
    background-color: #1e601e;
    color: white;
}

.form-update-brand {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0000006e;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-update {
    padding: 1em;
    background-color: white;
    border-radius: 0.5em;
    box-shadow: 0em 0em 1.5em -0.5em white;
    line-height: 2em;
}

.form-update-btn {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 1em;
}

.form-update p {
    text-transform: uppercase;
}

.form-update input {
    padding: 0.5em;
    width: 20em;
    font-size: 14px;
    outline: none;
    border: 1px solid gray;
    border-radius: 3px;
}

.form-update-btn button {
    padding: 0.5em 1em;
    font-size: 14px;
    background-color: white;
    border: 1px solid green;
    cursor: pointer;
    border-radius: 3px;
}
</style>
