<script>
import axios from 'axios'
export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            message_err: ''
        }
    },
    created() {
        document.title = "Đăng nhập";
    },
    methods: {
        async handleLogin() {
            try {
                const response = await axios.post('/admin/login', {
                    email: this.email,
                    password: this.password
                })
                if (response.data) {
                    $cookies.set('token', response.data)
                    this.$router.push('/')
                } else {
                    this.message_err = 'Sai tài khoản'
                    setTimeout(() => {
                        this.message_err = ''
                    }, 2000)
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>

<template>
    <div class="container">
        <img src="../assets//background_login.jpg" alt="" class="background">
        <div class="box">
            <div class="form">
                <h1>techz.com</h1>
            </div>
            <form @submit.prevent="handleLogin">
                <p class="title-login">Đăng nhập</p>
                <div class="input-group">
                    <label for="">Email</label>
                    <input type="text" v-model="email">
                </div>
                <div class="input-group">
                    <label for="">Mật khẩu</label>
                    <input type="password" v-model="password">
                </div>
                <p class="message-error" v-show="message_err.length > 0">{{message_err}}</p>
                <button>Đăng nhập</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.container {
    width: 100%;
    height: 100%;
    position: relative;
    font-family: 'Lato', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
}

.box {
    z-index: 1;
    padding: 1em;
    background-color: white;
    box-shadow: 0px 0px 20px -10px gray;
    border-radius: 0.5em;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

img.background {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}

.form {
    display: flex;
    align-items: center;
    padding: 1em;
}

form {
    padding: 1em;
}

.form h1 {
    text-transform: uppercase;
    letter-spacing: 8px;
    font-size: 45px;
    margin-bottom: 0.5em;
}

.title-login {
    font-size: 25px;
    margin-bottom: 5px;
    text-transform: uppercase;
    text-align: center;
}

input {
    margin: 5px 0;
    display: block;
    padding: 0.5em;
    width: calc(100% - 1em - 2px);
    border: 1px solid #949494;
    font-size: 18px;
    border-radius: 5px;
    outline: none;
}

label {
    margin: 5px 0;
    font-size: 18px;
}

button {
    margin-top: 10px;
    width: 100%;
    border: none;
    padding: 0.75em 0;
    font-size: 18px;
    font-weight: bold;
    background-color: #6060ff;
    color: white;
    cursor: pointer;
    border-radius: 5px;
}

p.message-error {
    text-align: center;
    padding: 5px;
    width: calc(100% - 10px);
    font-size: 14px;
    color: #c71313;
}
</style>
