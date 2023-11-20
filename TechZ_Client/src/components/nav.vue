<script>
import { mapState } from 'vuex'
export default {
    name: 'Nav',
    data() {
        return {
            category_select: 0
        }
    },
    computed: {
        ...mapState('nav', ['category'])
    },
    methods: {
        logout(){
            $cookies.remove('token')
            this.$router.push('/login')
        }
    }
}
</script>

<template>
    <nav>
        <img src="../assets/logo.png" alt="" class="img-logo">
        <div class="nav-box">
            <div class="nav-box-child">
                <img src="../assets/icon/kashifarif_user_profile_person_account_icon.png" alt="" class="icon-account">
                <div class="icon-and-name">
                    <p class="nav-user-name">{{ $store.state.user.role == 2 ? 'Admin:':'Nhân viên:' }} {{ $store.state.user.last_name + ' ' + $store.state.user.first_name }}</p>
                </div>
                <h4>Chung</h4>
                <ul>
                    <li :class="{ 'category-select': $route.path == '/' }">
                        <router-link to="/">Dashboard</router-link>
                    </li>
                    <li :class="{ 'category-select': $route.path == '/voucher' }">
                        <router-link to="/voucher">Quản lý Voucher</router-link>
                    </li>
                    <li :class="{ 'category-select': $route.path == '/order' }">
                        <router-link to="/order">Quản lý đơn hàng</router-link>
                    </li>
                    <li :class="{ 'category-select': $route.path == '/brand' }">
                        <router-link to="/brand">Quản lý nhãn hàng</router-link>
                    </li>
                    <li :class="{ 'category-select': $route.path == '/category' }">
                        <router-link to="/category">Quản lý danh mục</router-link>
                    </li>
                    <li :class="{ 'category-select': $route.path == '/employee' }">
                        <router-link to="/employee" v-if="$store.state.user.role==2">Quản lý nhân viên</router-link>
                    </li>
                    <li :class="{ 'category-select': $route.path == '/customer' }">
                        <router-link to="/customer">Quản lý khách hàng</router-link>
                    </li>
                </ul>
                <h4>Quản lý sản phẩm</h4>
                <ul>
                    <li v-for="cate in category" :key="cate.id">
                        <router-link :to="{ path: '/manage/' + cate.slug }">{{ cate.name }}</router-link>
                    </li>
                </ul>
                <h4>Đăng sản phẩm</h4>
                <ul>
                    <li v-for="cate in category" :key="cate.id">
                        <router-link :to="{ path: '/upload/' + cate.slug }">{{ cate.name }}</router-link>
                    </li>
                </ul>
            </div>
        </div>
        <button class="logout" @click="logout">Đăng xuất</button>
    </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

nav {
    background-color: #414b62;
    color: white;
    font-family: 'Lato', sans-serif;
    display: flex;
    flex-direction: column;
}

.nav-box {
    position: relative;
    flex: 1;
}

.nav-box-child {
    position: absolute;
    width: 100%;
    overflow-y: scroll;
    height: 100%;
}

.nav-box-child::-webkit-scrollbar {
  display: none;
}

img.img-logo {
    width: 60%;
    background-color: #343c52;
    padding: 10px 20%;
}

nav h4 {
    padding: 0.5em;
}

nav a {
    color: #8ffaff;
}

nav ul {
    list-style: none;
    margin-left: 2em;
}

nav ul li a {
    display: block;
    padding: 0.5em;
    font-size: 14px;
    width: calc(100% - 0);
}

li.category-select {
    background-color: #21273d;
}

nav ul li:hover {
    transition: 0.4s;
}

nav ul li:hover {
    background-color: #636a97;
}

p.nav-user-name {
    text-align: center;
    margin: 0.5em 0;
}

button.logout {
    padding: 5px;
    font-size: 14px;
    border: none;
    background-color: #333333;
    color: white;
    cursor: pointer;
}

img.icon-account {
    width: 25%;
    display: block;
    margin: 5px auto;
}
</style>
