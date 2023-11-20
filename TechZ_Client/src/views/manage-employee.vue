<script>
import Nav from '../components/nav.vue'
export default {
	name: 'ManageEmployee',
    created(){
        document.title = "Quanrt lý nhân viên";
    },
    components: {
        Nav
    }
}
</script>

<template>
    <div class="container">
        <Nav/>
        <router-view></router-view>
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
    font-family: 'Open Sans', sans-serif;
}
</style>
