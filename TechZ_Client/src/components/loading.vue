<script>
export default {
    name: 'Loading',
    props: ['loading']
}
</script>

<template>
    <div class="loading" v-if="loading">
        <div></div>
    </div>
</template>

<style scoped>
.loading {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0000005c;
    width: 100%;
    height: 100%;
}

.loading div {
    width: 2em;
    height: 2em;
    border: 5px solid white;
    border-radius: 50%;
    border-top: 5px solid #00000036;
    animation: 0.5s spin linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
