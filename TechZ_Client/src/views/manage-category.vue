<script>
import axios from 'axios'
import Nav from '../components/nav.vue'
export default {
    name: 'ManageCategory',
    data() {
        return {
            categorys: [],
            category_edit: null,
            category_name: '',
            id_category_delete: 0,
            category_select: null
        }
    },
    methods: {
        async getAllCategory() {
            var response = await axios.get('/admin/categorys')
            this.categorys = response.data
        },
        async addCategory() {
            if (this.category_name.length > 0) {
                var response = await axios.post('/admin/category', {
                    category_name: this.category_name
                })
                if (response.data) {
                    this.categorys.push(response.data)
                }
                this.category_name = ''
            }
        },
        selectCategoryID(id) {
            this.id_category_delete = id
        },
        cancel() {
            this.id_category_delete = 0
        },
        async deleteCategory() {
            if (this.id_category_delete) {
                var response = await axios.delete('/admin/category', {
                    params: {
                        id: this.id_category_delete
                    }
                })
                if (response.data) {
                    this.categorys.forEach((ct, i) => {
                        if (ct.id == this.id_category_delete) {
                            this.categorys.splice(i, 1)
                        }
                    })
                    this.id_category_delete = 0
                }
            }
        },
        selectCategory(category) {
            this.category_select = {...category}
        },
        async updateCategory(){
            if(this.category_select){
                var response = await axios.put('/admin/category', {
                    id: this.category_select.id,
                    name: this.category_select.name,
                    slug: this.category_select.slug
                })
                if(response.data){
                    this.categorys.forEach((ct, i) => {
                        if(ct.id==this.category_select.id){
                            this.categorys[i] = this.category_select
                        }
                    })
                }
                this.category_select = null
            }
        }
    },
    created() {
        document.title = "Quản lý danh mục";
        this.getAllCategory()
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
            <p class="p-title">Quản lý danh mục</p>
            <div class="row">
                <div class="box-category">
                    <ul>
                        <li v-for="(category, i ) in categorys" :key="i">
                            <p>{{ category.name }}</p>
                            <img src="../assets/icon/bxs_edit_alt_icon.png" alt="" class="img-icon icon-edit"
                                @click="selectCategory(category)">
                            <img src="../assets/icon/wrong_delete_remove_trash_minus_icon.png" alt="" class="img-icon"
                                @click="selectCategoryID(category.id)">
                        </li>
                    </ul>
                </div>
                <hr>
                <div class="box-add-category">
                    <p>Thêm danh mục</p>
                    <div class="input-category">
                        <input type="text" v-model="category_name" placeholder="Tên danh mục">
                        <button @click="addCategory">Thêm</button>
                    </div>
                </div>
                <div class="form-edit-category" v-if="category_select">
                    <div class="form-edit-category-child">
                        <p>Cập nhật danh mục</p>
                        <label for="">Tên danh mục:</label>
                        <input type="text" v-model="category_select.name">
                        <label for="">Slug danh mục:</label>
                        <input type="text" v-model="category_select.slug">
                        <div class="form-edit-category-btn">
                            <button @click="updateCategory">Cập nhật</button>
                            <button @click="() => category_select = null">Hủy</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-confirm" v-if="id_category_delete > 0">
            <button @click="deleteCategory">Xác nhận</button>
            <button @click="cancel">Hủy</button>
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
}

.box {
    padding: 0.5em;
    padding-left: 0em;
    height: calc(100% - 1em);
    font-family: 'Roboto', sans-serif;
}

.box .row {
    display: flex;
    flex-direction: row;
    padding-top: 1em;
    justify-content: space-evenly;
}

.box-category ul {
    list-style: none;
}

.box-category ul li {
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

.box-category ul li p {
    flex-grow: 1;
}

.input-category {
    margin-top: 0.5em;
    display: flex;
    align-items: center;
}

.input-category input {
    padding: 0.5em;
    outline: none;
    border: 1px solid #7c7c7c;
    font-size: 14px;
    border-radius: 3px;
}

.input-category button {
    flex: 1;
    width: 5em;
    margin-left: 0.5em;
    height: 2.3em;
    background-color: white;
    border: 1px solid #676767;
    border-radius: 3px;
    cursor: pointer;
}

.form-confirm {
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

.form-confirm button {
    padding: 0.5em 2em;
    background-color: white;
    border: none;
    margin: 0 5px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
}

.form-confirm button:first-child {
    background-color: #1e601e;
    color: white;
}

.form-edit-category {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #00000070;
}

.form-edit-category-child {
    display: flex;
    flex-direction: column;
    padding: 1em;
    background-color: white;
    border-radius: 0.5em;
    box-shadow: 0em 0em 2em -0.5em white;
    line-height: 2.3em;
}

.form-edit-category-child p {
    text-align: center;
    text-transform: uppercase;
}

.form-edit-category-child input {
    font-size: 14px;
    padding: 0.5em;
    outline: none;
    border: 1px solid gray;
    border-radius: 3px;
    width: 20em;
}

.form-edit-category-btn {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 1em;
}

.form-edit-category-btn button {
    padding: 0.5em 1.5em;
    background-color: white;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
}

.form-edit-category-btn button:hover {
    background-color: #d8d8d8;
}

p.p-title {
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 1em;
}

</style>
