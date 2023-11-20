<script>
import Nav from '../components/nav.vue'
import HomeForm from '../components/home/home.vue'
export default {
	name: 'Home',
    components: {
        Nav,
        HomeForm
    },
    created(){
        document.title = "Dashboard";
    }
}
</script>

<template>
    <div class="container">
        <Nav/>
        <HomeForm/>
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
</style>
