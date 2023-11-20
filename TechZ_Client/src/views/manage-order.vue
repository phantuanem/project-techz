<script>
import Nav from '../components/nav.vue'
import TableOrder from '../components/order/table-order.vue'
import axios from 'axios'

export default {
	name: 'ManageOrder',
    data(){
        return {
            orders: null
        }
    },
    methods: {
        async getOrders(){
            try {
                let response = await axios.get('/admin/orders')
                this.orders = response.data
                this.orders.forEach(item => {
                    item.show=true
                })
            }catch(e){
                console.log(e)
            }
        },
        searcOrder(orderID){
            if(orderID){
                this.orders.forEach(item => {
                    if(item.orderID.toString().indexOf(orderID) < 0){
                        item.show = false
                    } else {
                        item.show = true
                    }
                })
            } else {
                this.orders.forEach(item => {
                    item.show=true
                })
            }
        }
    },
    created(){
        document.title = "Quảng lý đơn hàng";
        this.getOrders()
    },
    components: {
        Nav,
        TableOrder
    }
}
</script>

<template>
    <div class="container">
        <Nav/>
        <div class="box">
            <TableOrder :orders="orders" :searcOrder="searcOrder"/>
        </div>
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
}

.box {
    padding: 0.5em 0.5em 0.5em 0;
    font-family: "Poppins", Arial, sans-serif;
    height: calc(100% - 1em);
    overflow-y: scroll;
}

</style>
