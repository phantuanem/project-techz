<script>
import Nav from '../components/nav.vue'
import axios from 'axios'
export default {
    name: 'Voucher',
    data() {
        return {
            vouchers: [],
            id_voucher_delete: 0,
            voucher_select: null
        }
    },
    methods: {
        async getVoucher() {
            var response = await axios.get('/admin/voucher')
            this.vouchers = response.data
        },
        async deleteVoucher() {
            if (this.id_voucher_delete > 0) {
                var response = await axios.delete('/admin/voucher', {
                    params: {
                        id: this.id_voucher_delete
                    }
                })
                if (response.data) {
                    this.vouchers.forEach((voucher, i) => {
                        if (voucher.id == this.id_voucher_delete) {
                            this.vouchers.splice(i, 1)
                        }
                    })
                    this.id_voucher_delete = 0
                }
            }
        },
        async updateVoucher() {
            if(this.voucher_select){
                var response = await axios.put('/admin/voucher', {
                    id: this.voucher_select.id,
                    amount: this.voucher_select.amount
                })
                if (response.data) {
                    this.vouchers.forEach(voucher => {
                        if (voucher.id == this.voucher_select.id) {
                            voucher.amount = this.voucher_select.amount
                        }
                    })
                    this.voucher_select = null
                }
            }
        }
    },
    created() {
        document.title = "Quản lý voucher";
        this.getVoucher()
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
            <p class="title">Quản lý Voucher</p>
            <div class="row">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Voucher Code</th>
                            <th>Tiền giảm</th>
                            <th>Ngày phát hành</th>
                            <th>Trạng thái</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(voucher, i) in vouchers" :key="i">
                            <td>{{ i + 1 }}</td>
                            <td>{{ voucher.voucher_code }}</td>
                            <td>{{ voucher.amount.toLocaleString('vi', { style: 'currency', currency: 'VND' }) }}</td>
                            <td>{{ voucher.create_date.hour + ':' + voucher.create_date.minute + ' - ' +
                                voucher.create_date.day + '/' + voucher.create_date.month + '/' + voucher.create_date.year
                            }}</td>
                            <td :class="{ 'voucher-is-used': voucher.is_used }">{{ voucher.is_used ? 'Đã sử dụng' : 'Chưa sử dụng' }}</td>
                            <td>
                                <button v-if="!voucher.is_used" @click="() => id_voucher_delete = voucher.id">Xóa</button>
                                <button v-if="!voucher.is_used" @click="() => voucher_select = {...voucher}">Chỉnh sửa</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="box-confirm" v-if="id_voucher_delete > 0">
                <button @click="deleteVoucher">Xác nhận</button>
                <button @click="() => id_voucher_delete = 0">Hủy</button>
            </div>
            <div class="box-update" v-if="voucher_select">
                <div class="form-update-voucher">
                    <p class="title-update">Chỉnh sửa Voucher</p>
                    <label for="">Voucher Code:</label>
                    <input type="text" :value="voucher_select.voucher_code" disabled>
                    <label for="">Số tiền:</label>
                    <input type="text" v-model="voucher_select.amount">
                    <div class="form-update-voucher-btn">
                        <button @click="updateVoucher">Cập nhật</button>
                        <button @click="() => voucher_select = null">Hủy</button>
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
    grid-gap: 1em;
}

.box {
    padding: 0.5em;
    padding-left: 0em;
    height: calc(100% - 1em);
    font-family: "Poppins", Arial, sans-serif;
    font-size: 14px;
}

p.title {
    text-align: center;
    text-transform: uppercase;
    font-size: 16px;
    height: 2em;
}

.row {
    height: calc(100% - 2.5em);
}

table {
    width: 100%;
}

.table table,
.table th,
.table td {
    border: none;
    border-collapse: collapse;
    font-size: 14px;
    font-family: "Poppins", Arial, sans-serif;
}

thead tr th {
    padding: 10px 15px;
    background-color: #f1f1f1;
    font-weight: 400;
    text-transform: uppercase;
}

table tr:nth-child(even) {
    background-color: #f1f1f1;
}

tbody tr td {
    padding: 8px 15px;
    text-align: center;
}

td.voucher-is-used {
    background-color: #b84b4b;
    color: white;
}

td button {
    padding: 6px 15px;
    background-color: #1652f0;
    color: white;
    border: none;
    margin: 0 5px;
    border-radius: 3px;
    cursor: pointer;
}

td button:first-child {
    background-color: #e62143;
}

.box-confirm {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0000005c;
    display: flex;
    align-items: center;
    justify-content: center;
}

.box-confirm button {
    font-size: 14px;
    padding: 0.5em 2em;
    margin: 0 5px;
    background-color: white;
    border: 1px solid gray;
    border-radius: 3px;
    cursor: pointer;
}

.box-confirm button:hover {
    background-color: #e5e5e5;
}

.box-update {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000047;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-update-voucher {
    padding: 1.5em;
    background-color: white;
    box-shadow: 0em 0em 1.5em -0.5em white;
    border-radius: 0.5em;
    display: flex;
    flex-direction: column;
    width: 22em;
}

p.title-update {
    margin-bottom: 0.5em;
    text-align: center;
    text-transform: uppercase;
}

.form-update-voucher input {
    font-size: 14px;
    padding: 0.5em;
    margin: 5px 0;
    outline: none;
}

.form-update-voucher-btn {
    margin-top: 0.5em;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
}

.form-update-voucher-btn button {
    font-size: 14px;
    padding: 0.5em 2em;
    margin: 0 5px;
    background-color: white;
    border: 1px solid gray;
    border-radius: 3px;
    cursor: pointer;
}

.form-update-voucher-btn button:hover {
    background-color: #e5e5e5;
}
</style>
