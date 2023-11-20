<script>
import axios from 'axios'
import Loading from '../loading.vue'

export default {
    name: 'AddEmployee',
    data() {
        return {
            first_last: '',
            first_name: '',
            password: '',
            email: '',
            phone: '',
            loading: false,
            data_address: null,
            detail: '',
            address: null,
            position: ''
        }
    },
    methods: {
        async addEmployee() {
            try {
                // var citis = document.getElementById("city");
                // var districts = document.getElementById("district");
                // var wards = document.getElementById("ward");
                this.loading = true
                let response = await axios.post('/admin/employee/add', {
                    last_name: this.last_name,
                    first_name: this.first_name,
                    password: this.password,
                    email: this.email,
                    position: this.position
                })
                this.loading = false
                this.last_name = ''
                this.first_name = ''
                this.password = ''
                this.email = ''
                this.position = ''
            } catch (e) {
                console.log(e)
            }
        },
        renderCity(data) {
            var citis = document.getElementById("city");
            var districts = document.getElementById("district");
            var wards = document.getElementById("ward");
            for (const x of data) {
                var opt = document.createElement('option');
                opt.value = x.Name;
                opt.text = x.Name;
                opt.setAttribute('data-id', x.Id);
                citis.options.add(opt);
            }
            citis.onchange = function () {
                district.length = 1;
                ward.length = 1;
                if (this.options[this.selectedIndex].dataset.id != "") {
                    const result = data.filter(n => n.Id === this.options[this.selectedIndex].dataset.id);

                    for (const k of result[0].Districts) {
                        var opt = document.createElement('option');
                        opt.value = k.Name;
                        opt.text = k.Name;
                        opt.setAttribute('data-id', k.Id);
                        district.options.add(opt);
                    }
                }
            };
            district.onchange = function () {
                ward.length = 1;
                const dataCity = data.filter((n) => n.Id === citis.options[citis.selectedIndex].dataset.id);
                if (this.options[this.selectedIndex].dataset.id != "") {
                    const dataWards = dataCity[0].Districts.filter(n => n.Id === this.options[this.selectedIndex].dataset.id)[0].Wards;

                    for (const w of dataWards) {
                        var opt = document.createElement('option');
                        opt.value = w.Name;
                        opt.text = w.Name;
                        opt.setAttribute('data-id', w.Id);
                        wards.options.add(opt);
                    }
                }
            };
        }
    },
    async created() {
        try {
            var response = await axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
            this.data_address = response.data
            this.renderCity(response.data)
        } catch (e) {
            console.log(e)
        }
    },
    components: {
        Loading
    }
}
</script>

<template>
    <div class="box">
        <router-link to="/employee"><img src="../../assets/icon/arrow_back_left_icon.png" alt=""
                class="img-icon-back"></router-link>
        <h3>Thêm nhân viên</h3>
        <form @submit.prevent="addEmployee">
            <div class="input-group">
                <label for="">Họ:</label>
                <input type="text" v-model="last_name">
            </div>
            <div class="input-group">
                <label for="">Tên:</label>
                <input type="text" v-model="first_name">
            </div>
            <div class="input-group">
                <label for="">Email:</label>
                <input type="text" v-model="email">
            </div>
            <div class="input-group">
                <label for="">Mật khẩu:</label>
                <input type="password" v-model="password">
            </div>
            <div class="input-group">
                <label for="">Vị trí:</label>
                <input type="text" v-model="position">
            </div>
            <!-- <div class="input-group">
                <label for="">Số điện thoại</label>
                <input type="text" v-model="phone">
            </div>
            <div class="input-group">
                <label for="">Địa chỉ</label>
                <select id="city">
                    <option value="" selected>Chọn tỉnh thành</option>
                </select>

                <select id="district">
                    <option value="" selected>Chọn quận huyện</option>
                </select>

                <select id="ward">
                    <option value="" selected>Chọn phường xã</option>
                </select>
            </div>
            <div class="input-group">
                <label for="">Địa chỉ cụ thể</label>
                <textarea v-model="detail"></textarea>
            </div> -->
            <button>Thêm</button>
        </form>
        <Loading :loading="loading"/>
    </div>
</template>

<style scoped>

.box {
    padding: 0.5em;
    padding-left: 0;
}

img.img-icon-back {
    width: 1.2em;
}

label {
    display: block;
    font-size: 16px;
    margin-bottom: 3px;
}

form input,
form textarea {
    max-width: 35em;
    width: 50%;
    min-width: 20px;
    font-size: 14px;
    padding: 0.5em;
    margin-bottom: 1em;
    outline: none;
    border: 1px solid #6c6c6c;
    border-radius: 3px;
}

form textarea {
    min-height: 5em;
}

form button {
    font-size: 14px;
    padding: 8px 2em;
    border: 1px solid black;
    border-radius: 3px;
    background-color: white;
    cursor: pointer;
}

.input-group select {
    font-size: 1em;
    padding: 8px;
    display: block;
    margin: 0.5em 0;
    margin-left: 2em;
    cursor: pointer;
}
</style>
