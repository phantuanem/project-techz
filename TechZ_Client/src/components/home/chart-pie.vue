<script>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)
export default {
	name: 'ChartBar',
    props: ['data'],
    data(){
        return {
            options: {
                responsive: true
            }
        }
    },
    components: {
        Pie
    }
}
</script>

<template>
    <Pie :data="data" :options="options"/>
</template>

<style scoped>
</style>
