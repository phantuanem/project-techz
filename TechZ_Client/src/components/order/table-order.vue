<script>
import axios from 'axios'
import OrderDetail from './order-detail.vue'

export default {
    name: 'TableOrder',
    props: ['orders', 'searcOrder'],
    data() {
        return {
            order_id_selected: '',
            search_order_id: '',
            id_order_cancel: 0,
            text_reason: '',
            select_order_status: '0'
        }
    },
    methods: {
        async changeOrderStatus(e, orderID) {
            try {
                if (e.target.value == 'cancel') {
                    this.id_order_cancel = orderID
                } else {
                    let response = await axios.put('/admin/order-status', {
                        status: e.target.value,
                        orderID: orderID
                    })
                }
                if (e.target.value == 'delivered') {

                }
            } catch (e) {
                console.log(e)
            }
        },
        async selectOrder(orderID) {
            this.order_id_selected = orderID
        },
        async cancelOrder() {
            try {
                if (this.id_order_cancel > 0 && this.text_reason.length > 0) {
                    let response = await axios.put('/admin/order-status', {
                        status: 'cancel',
                        orderID: this.id_order_cancel,
                        text_reason: this.text_reason
                    })
                    this.text_reason = ''
                    this.id_order_cancel = 0
                }
            } catch (e) {
                console.log(e)
            }
        },
        async giveVoucher(has_voucher, orderID) {
            if (!has_voucher) {
                var response = await axios.post('/admin/give/voucher', {
                    orderID: orderID
                })
                if (response.data) {
                    this.$parent.orders.forEach((order, i) => {
                        if (order.orderID == orderID) {
                            order.has_voucher = true
                        }
                    })
                }
            }
        }
    },
    watch: {
        search_order_id: function () {
            this.searcOrder(this.search_order_id)
        },
        select_order_status: function () {
            switch (this.select_order_status) {
                case '1':
                    this.$parent.orders.forEach((order, i) => {
                        if (order.new && !order.processing && !order.shipping && !order.delivered) {
                            order.show = true
                        } else {
                            order.show = false
                        }
                    })
                    break;
                case '2':
                    this.$parent.orders.forEach((order, i) => {
                        if (order.new && order.processing && !order.shipping && !order.delivered) {
                            order.show = true
                        } else {
                            order.show = false
                        }
                    })
                    break;
                case '3':
                    this.$parent.orders.forEach((order, i) => {
                        if (order.new && order.processing && order.shipping && !order.delivered) {
                            order.show = true
                        } else {
                            order.show = false
                        }
                    })
                    break;
                case '4':
                    this.$parent.orders.forEach((order, i) => {
                        if (order.new && order.processing && order.shipping && order.delivered) {
                            order.show = true
                        } else {
                            order.show = false
                        }
                    })
                    break;
                case '5':
                    this.$parent.orders.forEach((order, i) => {
                        if (!order.new && !order.processing && !order.shipping && !order.delivered) {
                            order.show = true
                        } else {
                            order.show = false
                        }
                    })
                    break;
                default:
                    this.$parent.orders.forEach((order, i) => {
                        order.show = true
                    })
            }
        }
    },
    components: {
        OrderDetail
    }
}
</script>

<template>
    <div>
        <div class="box-filter">
            <div class="search">
                <input type="text" placeholder="Mã đơn hàng" v-model="search_order_id">
            </div>
            <select name="" id="select-order-status" v-model="select_order_status">
                <option value="0">Tất cả</option>
                <option value="1">Chờ xác nhận</option>
                <option value="2">Đang chuẩn bị hàng</option>
                <option value="3">Đang giao hàng</option>
                <option value="4">Đã giao hàng</option>
                <option value="5">Hủy đơn</option>
            </select>
        </div>
        <table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>MÃ ĐH</th>
                    <th>Tên HK</th>
                    <th>Địa chỉ giao hàng</th>
                    <th>Số ĐT liên lạc</th>
                    <th>Ngày đặt hàng</th>
                    <th>Trạng thái đơn hàng</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, i) in orders" :key="i" v-show="order.show">
                    <td>{{ i + 1 }}</td>
                    <td>{{ order.orderID }}</td>
                    <td>{{ order.name }}</td>
                    <td>{{ order.delivery_address }}</td>
                    <td>{{ order.phone_number }}</td>
                    <td>
                        <p>{{ order.order_date.hour + ':' + order.order_date.minute }}</p>
                        <p>{{ order.order_date.day + '/' +
                            order.order_date.month + '/' + order.order_date.year }}</p>
                    </td>
                    <td>
                        <select @change="changeOrderStatus($event, order.orderID)">
                            <option value="cancel"
                                :selected="!order.new && !order.processing && !order.shipping && !order.delivered">Hủy đơn
                            </option>
                            <option value="new"
                                :selected="order.new && !order.processing && !order.shipping && !order.delivered">Chờ xác
                                nhận</option>
                            <option value="processing"
                                :selected="order.new && order.processing && !order.shipping && !order.delivered">Đang chuẩn
                                bị hàng</option>
                            <option value="shipping"
                                :selected="order.new && order.processing && order.shipping && !order.delivered">Đang giao
                                hàng</option>
                            <option value="delivered"
                                :selected="order.new && order.processing && order.shipping && order.delivered">Đã giao hàng
                            </option>
                        </select>
                    </td>
                    <td><button
                            :class="{ 'btn-order-has-voucher': !order.has_voucher, 'btn-order-not-has-voucher': order.has_voucher }"
                            v-if="order.total >= 1000000 && order.new && order.processing && order.shipping && order.delivered"
                            @click="giveVoucher(order.has_voucher, order.orderID)">{{
                                order.has_voucher ? 'Đã tặng Voucher' : 'Tặng Voucher' }}</button></td>
                    <td><button @click="selectOrder(order.orderID)">Hóa đơn</button></td>
                </tr>
            </tbody>
        </table>
        <OrderDetail v-if="order_id_selected" :orderID="order_id_selected" />
        <div class="form-confirm-cancel-order" v-if="id_order_cancel > 0">
            <div class="box-confirm-cancel-order">
                <p class="title">hủy đơn hàng {{ id_order_cancel }}</p>
                <p>Lý do hủy đơn:</p>
                <textarea v-model="text_reason" placeholder="Lý do hủy đơn hàng"></textarea>
                <div class="box-confirm-cancel-order-btn">
                    <button @click="cancelOrder">Xác nhận</button>
                    <button @click="() => id_order_cancel = 0">Hủy</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
table {
    width: 100%;
    font-size: 14px;
}

thead tr th {
    padding: 15px;
    background-color: #0038aa;
    color: white;
    position: sticky;
    top: 0;
    text-transform: uppercase;
}

tbody tr td {
    padding: 8px 15px;
}

tbody tr td:nth-child(3) {
    width: 10em;
}

tbody tr td:nth-child(4) {
    width: 20em;
}

tr:nth-child(even) {
    background-color: #e2e0e0;
}

select {
    padding: 5px;
    cursor: pointer;
}

td button {
    border: none;
    color: white;
    background-color: #ba6328;
    padding: 10px;
    border-radius: 3px;
    cursor: pointer;
}

.search input {
    font-size: 14px;
    padding: 8px 1em;
    outline: none;
    border-radius: 2em;
    border: 1px solid gray;
    background-color: #fafafa;
    width: calc(100% - 2em);
}

table tr td p {
    text-align: center;
}

table,
th,
td {
    border: 0 solid gray;
    border-collapse: collapse;
}

tbody tr td:first-child,
tbody tr td:nth-child(2),
tbody tr td:nth-child(5),
tbody tr td:nth-child(7),
tbody tr td:nth-child(8) {
    text-align: center;
}

.form-confirm-cancel-order {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0000007a;
    display: flex;
    align-items: center;
    justify-content: center;
}

.box-confirm-cancel-order {
    background-color: white;
    padding: 1.5em;
    border-radius: 0.5em;
    box-shadow: 0em 0em 1.5em -0.5em white;
    width: 25em;
}

.box-confirm-cancel-order p.title {
    font-size: 15px;
    text-align: center;
    text-transform: uppercase;
}

.box-confirm-cancel-order textarea {
    padding: 1em;
    outline: none;
    border: 1px solid black;
    border-radius: 0.5em;
    margin: 0.5em 0;
    width: calc(100% - 2em - 2px);
    min-height: 8em;
}

.box-confirm-cancel-order-btn {
    display: flex;
    justify-content: space-evenly;
}

.box-confirm-cancel-order-btn button {
    border: 1px solid black;
    background-color: white;
    font-size: 14px;
    border-radius: 3px;
    padding: 0.5em 0;
    width: 7em;
    cursor: pointer;
}

.box-filter {
    display: flex;
    align-items: center;
    margin-bottom: 0.5em;
}

.search {
    width: 50%;
}

select#select-order-status {
    margin-left: 1em;
}

button.btn-order-has-voucher {
    background-color: #5d5dff !important;
}

button.btn-order-not-has-voucher {
    background-color: #757575 !important;
    pointer-events: none;
}
</style>
