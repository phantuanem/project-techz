<script>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
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
        Bar
    }
}
</script>

<template>
    <Bar :data="data" :options="options"/>
</template>

<style scoped>
</style>
