<script>
import axios from 'axios';
import Loading from '../loading.vue'
import FormAddress from '../form-address.vue'

export default {
	name: 'UpdateInfoEmployee',
    data(){
        return {
            employee: {},
            loading: false
        }
    },
    methods: {
        async getEmployee(){
            try {
                this.loading = true
                let response = await axios.get('/admin/employee',{
                    params: {
                        accountID: this.$route.params.accountID
                    }
                })
                this.employee = response.data
                this.loading = false
            }catch(e){
                console.log(e)
            }
        },
        async updateInfoEmployee(){
            try {
                this.loading = true
                let response = await axios.put('/admin/employee',{
                    employee: this.employee
                })
                this.loading = false
            }catch(e){
                console.log(e)
            }
        },
        onChangeFormUpdateAddress(address){
            this.address = address
        }
    },
    created(){
        this.getEmployee()
    },
    components: {
        Loading,
        FormAddress
    }
}
</script>

<template>
    <div class="box">
        <p class="title">Cập nhật thông tin tài khoản nhân viên</p>
        <form @submit.prevent="updateInfoEmployee">
            <label for="">Họ:</label>
            <input type="text" v-model="employee.last_name">
            <label for="">Tên:</label>
            <input type="text" v-model="employee.first_name">
            <label for="">Vị trí:</label>
            <input type="text" v-model="employee.position">
            <label for="">Email:</label>
            <input type="text" v-model="employee.email">
            <label for="">Mật khẩu mới:</label>
            <input type="text">
            <!-- <FormAddress :onChangeFormUpdateAddress="onChangeFormUpdateAddress"/> -->
            <button>Lưu</button>
        </form>
        <Loading :loading="loading"/>
    </div>
</template>

<style scoped>
form {
    width: 100%;
    margin-top: 0.5em;
}

form label {
    display: block;
    font-size: 1em;
    margin-bottom: 3px;
}

form input {
    font-size: 1em;
    padding: 5px 10px;
    min-width: 15em;
    max-width: 25em;
    outline: none;
    border: 1px solid #8e8e8e;
    margin-bottom: 0.5em;
    display: block;
}

form button {
    font-size: 14px;
    padding: 0.5em 3em;
    background-color: white;
    border: 1px solid black;
    border-radius: 3px;
    cursor: pointer;
}

p.title {
    text-align: center;
    text-transform: uppercase;
}
</style>