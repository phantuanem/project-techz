<script>
import axios from 'axios'
import Nav from '../components/nav.vue'
export default {
    name: 'ManageCustomer',
    data() {
        return {
            list: {}
        }
    },
    methods: {
        async getCustomer() {
            try {
                let response = await axios.get('/admin/customers')
                this.list = response.data
            } catch (e) {
                console.log(e)
            }
        }
    },
    created() {
        document.title = "Quản lý khách hàng";
        this.getCustomer()
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
            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên Khách Hàng</th>
                            <th>Email</th>
                            <th>Số ĐT</th>
                            <th>Địa chỉ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(customer, i) in list" :key="i">
                            <td>{{ i + 1 }}</td>
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.email }}</td>
                            <td>{{ customer.phone_number }}</td>
                            <td>{{ customer.address }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

.container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 12em 1fr;
    grid-gap: 10px;
    font-family: "Poppins", Arial, sans-serif;
}

.box {
    padding: 0.5em 0.5em 0.5em 0em;
}

table {
    width: 100%;
    font-size: 14px;
}

thead tr th {
    padding: 10px;
    background-color: #9fb09e;
    color: white;
}

tbody tr td {
    padding: 10px 10px;
}

table,
th,
td {
    border: 0px solid gray;
    border-collapse: collapse;
}

tbody tr td:first-child {
    text-align: center;
}

tr:nth-child(even) {
    background-color: #e2e0e0;
}

</style>
