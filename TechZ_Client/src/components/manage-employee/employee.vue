<script>
import axios from 'axios'
export default {
	name: 'Employee',
    data() {
        return {
            employees: []
        }
    },
    methods: {
        async getEmployees(){
            try {
                let response = await axios.get('/admin/employees')
                this.employees = response.data
            }catch(e){
                console.log(e)
            }
        },
        async deleteEmployee(accountID){
            try {
                let response = await axios.delete('/admin/employee',{
                    params: {
                        accountID: accountID
                    }
                })
                if(response.data) {
                    this.employees.forEach((em, i) => {
                        if(em.accountID == accountID){
                            this.employees.splice(i, 1)
                        }
                    })
                }
            }catch(e){
                console.log(e)
            }
        }
    },
    created(){
        this.getEmployees()
    }
}
</script>

<template>
    <div class="box">
        <p class="title">Quản lý nhân viên</p>
        <router-link to="/employee/add" class="a-add-employee">Thêm nhân viên</router-link>
        <div class="table">
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ và Tên</th>
                        <th>Email</th>
                        <th>Vị trí</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(employee, i) in employees" :key="i">
                        <td>{{ i+1 }}</td>
                        <td>{{ employee.last_name + ' ' + employee.first_name }}</td>
                        <td>{{ employee.email }}</td>
                        <td>{{ employee.position }}</td>
                        <td>
                            <router-link :to="{name: 'UpdateInfoEmployee', params: {accountID: employee.accountID}}">Sửa</router-link>
                            <button @click="deleteEmployee(employee.accountID)">Xóa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>

.box {
    padding: 0.5em;
    margin-left: 0;
    height: calc(100% - 1em);
}

p.title {
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 0.5em;
}

.table {
    margin-top: 0.5em;
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

tbody tr td:nth-child(2),
tbody tr td:nth-child(3) {
    text-align: left;
}

tbody tr td:nth-child(2) {
    width: 15em;
}

td a {
    display: inline-block;
    border: none;
    padding: 0px 15px;
    font-size: 14px;
    border-radius: 3px;
    background-color: #5da452;
    color: white;
    height: 1.75em;
    line-height: 1.75;
}

a.a-add-employee,
td button {
    border: 1px solid blue;
    padding: 5px 20px;
    margin: 0.5em 0;
    display: inline-flex;
    border-radius: 3px;
    margin: 0 5px;
    cursor: pointer;
    padding: 0px 20px;
}

td button {
    color: black;
    background-color: #efc346;
    border: none;
    height: 1.75em;
    line-height: 1.75;
}

a.a-add-employee {
    font-size: 14px;
    margin: 0;
    padding: 5px 10px;
}

.table tbody tr td:last-child {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

</style>
