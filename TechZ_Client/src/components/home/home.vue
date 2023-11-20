<script>
// tham khao bieu do https://vue-chartjs.org/examples/
import ChartBar from './chart-bar.vue'
import ChartPie from './chart-pie.vue'
import axios from 'axios'

export default {
    name: 'ComponentHome',
    data() {
        return {
            count_customer: 0,
            count_product: 0,
            count_brand: 0,
            count_invoice: 0,
            show_chart: false,
            data_bar: {
                labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                datasets: [
                    {
                        label: 'Tổng tiền',
                        backgroundColor: '#4a3cc6',
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            },
            data_pie: {
                labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                datasets: [
                    {
                        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                        data: [40, 20, 80, 10]
                    }
                ]
            },
            backgroundColorPie: ['#217521', '#213075', '#752164', '#a20020', '#9bde00', '#9bde00', '#612908', '#00eaff', '#5d6262', '#786aff']
        }
    },
    methods: {
        async getSumAll() {
            try {
                let response = await axios.get('/admin/dashboard')
                response.data.months.forEach(month => {
                    this.data_bar.datasets[0].data[month.month - 1] = month.sum_total_amount
                });
                let label_pie = []
                let total_pie = []
                let background_pie = []
                response.data.total_cagegory.forEach((ct, i) => {
                    label_pie.push(ct.name)
                    total_pie.push(ct.total)
                    background_pie.push(this.backgroundColorPie[i])
                })
                this.data_pie.labels = label_pie
                this.data_pie.datasets[0].backgroundColor = background_pie
                this.data_pie.datasets[0].data = total_pie
                this.count_customer = response.data.count_customer.count
                this.count_product = response.data.count_product.count
                this.count_brand = response.data.count_brand.count
                this.count_invoice = response.data.count_invoice.count
                this.show_chart = true
            } catch (e) {
                console.log(e)
            }
        }
    },
    created() {
        this.getSumAll()
    },
    components: {
        ChartBar,
        ChartPie
    },
}
</script>

<template>
    <div class="box">
        <div class="row">
            <div class="box-item">
                <h1>{{ count_customer }}</h1>
                <p>Khách hàng</p>
                <img src="../../assets/icon/user_circle_light_icon.png" alt="" class="icon">
            </div>
            <div class="box-item">
                <h1>{{ count_product }}</h1>
                <p>Sản phẩm</p>
                <img src="../../assets/icon/filter_goods_item_label_product_icon.png" alt="" class="icon">
            </div>
            <div class="box-item">
                <h1>{{ count_brand }}</h1>
                <p>Thương hiệu</p>
                <img src="../../assets/icon/shop_icon.png" alt="" class="icon">
            </div>
            <div class="box-item">
                <h1>{{ count_invoice }}</h1>
                <p>Đơn hàng</p>
                <img src="../../assets/icon/bill_invoice_payment_receipt_billing_icon.png" alt="" class="icon">
            </div>
        </div>
        <div class="box-chart">
            <p class="title-chart">Thống kê danh thu theo tháng năm 2023</p>
            <div class="box-chart-canvas">
                <ChartBar :data="data_bar" v-if="show_chart" />
            </div>
        </div>
        <!-- <div class="box-chart">
            <p class="title-chart">Thống kê danh thu theo danh mục</p>
            <div class="box-chart-canvas box-chart-pie">
                <ChartPie :data="data_pie" v-if="show_chart" />
            </div>
        </div> -->
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

.box {
    width: calc(100% - 1em);
    height: calc(100% - 20px);
    overflow-y: scroll;
    padding: 10px 0;
    padding-right: 1em;
    font-family: "Poppins", Arial, sans-serif;
}

.row {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 1em;
}

img.icon {
    width: 100%;
}

.box-item {
    display: grid;
    grid-template-areas:
        "a1 a3 a3"
        "a2 a3 a3"
        "a2 a3 a3";
    width: 80%;
    padding: 10%;
    background-color: #321fdb;
    color: white;
    border-radius: 10px;
}

.row .box-item:nth-child(2) {
    background-color: #269d26;
}

.row .box-item:nth-child(3) {
    background-color: #756037;
}

.row .box-item:nth-child(4) {
    background-color: #453a59;
}

.box-item h1 {
    grid-area: a1;
    font-size: 30px;
    border-bottom: 1px solid white;
    height: 1.5em;
}

.box-item p {
    grid-area: a2;
    font-size: 20px;
}

.box-item img {
    grid-area: a3;
    margin-left: 1em;
}

.box-chart {
    margin-top: 1em;
}

.box-chart-canvas {
    padding: 1em 15%;
}

.box-chart-canvas.box-chart-pie {
    padding: 1em 25%;
}
</style>
