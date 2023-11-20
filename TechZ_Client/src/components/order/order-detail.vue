<script>
import axios from 'axios'
import html2pdf from "html2pdf.js";
import Vue3Barcode from 'vue3-barcode'
import printHtmlBlock from 'print-html-block';

export default {
    name: 'ORderDetail',
    props: ['orderID'],
    data() {
        return {
            list: [],
            order: {},
            date: {}
        }
    },
    methods: {
        async getOrder() {
            try {
                if (this.orderID) {
                    var date = new Date()
                    this.date.date = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
                    this.date.month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
                    this.date.year = date.getFullYear()
                    let response = await axios.get('/admin/order', {
                        params: {
                            orderID: this.orderID
                        }
                    })
                    this.list = response.data.list
                    this.order = response.data.order
                }
            } catch (e) {
                console.log(e)
            }
        },
        exportToPDF() {
            html2pdf(document.querySelector(".box-pdf"), {
                margin: 5,
                filename: 'HD' + this.orderID + ".pdf",
            });
            
        },
        async printInvoid(){
            const selector = '#print-invoice';
            const options = {
                importStyle: true
            };

            printHtmlBlock(selector, options);
        },
        close() {
            this.$parent.order_id_selected = ''
        }
    },
    created() {
        this.getOrder()
    },
    watch: {
        orderID: function () {
            this.getOrder()
        }
    },
    components: {
        Vue3Barcode,
    }
}
</script>

<template>
    <div class="box-order-detail">
        <div class="order-detail-table" v-if="order.id">
            <div class="box-pd-border">
                <section id="print-invoice">
                    <div class="box-pdf">
                        <div class="box-pdf-top">
                            <div></div>
                            <div class="box-pdf-top-company">
                                <h1>TechZ.com</h1>
                                <p>SĐT: 0928374658</p>
                                <p>Email: techz@gmail.com</p>
                                <p>Địa chỉ: Đường 3 tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ</p>
                            </div>
                        </div>
                        <div class="box-pdf-top-invoi-info">
                            <div class="box-pdf-top-invoi-info-child">
                                <p class="title-invoice">hóa đơn</p>
                                <Vue3Barcode :value="orderID" :height="30" v-if="order.id" />
                            </div>
                        </div>
                        <table class="info-customer-and-admin">
                            <tbody>
                                <tr>
                                    <td><h4>Nhân viên:</h4></td>
                                    <td><p>{{$store.state.user.last_name + ' ' + $store.state.user.first_name}}</p></td>
                                </tr>
                                <tr>
                                    <td><h4>Ngày in:</h4></td>
                                    <td><p>{{ date.date + '/' + date.month + '/' + date.year }}</p></td>
                                </tr>
                                <tr>
                                    <td><br></td>
                                    <td><br></td>
                                </tr>
                                <tr>
                                    <td><h4>Tên KH:</h4></td>
                                    <td><p>{{ order.customer_name }}</p></td>
                                </tr>
                                <tr>
                                    <td><h4>Số ĐT:</h4></td>
                                    <td><p>{{ order.phone_number }}</p></td>
                                </tr>
                                <tr>
                                    <td><h4>Địa chỉ:</h4></td>
                                    <td><p>{{ order.delivery_address }}</p></td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table-product">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên Sản Phẩm</th>
                                    <th>Bảo hành<br>(tháng)</th>
                                    <th>Đơn Giá</th>
                                    <th>Số Lượng</th>
                                    <th>Thành Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in list" :key="i">
                                    <td>{{ i + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.quarranty_period > 0 ? item.quarranty_period : 0 }}</td>
                                    <td>{{ item.price.toLocaleString('vi', { style: 'currency', currency: 'VND' }) }}</td>
                                    <td>{{ item.quantity }}</td>
                                    <td>{{ (item.quantity * item.price).toLocaleString('vi', {
                                        style: 'currency', currency:
                                            'VND'
                                    }) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="table-bottom">
                            <table>
                                <tr class="amount-small" v-if="order.voucher_amount">
                                    <td>
                                        <p>Tổng:</p>
                                    </td>
                                    <td>
                                        <h4>{{ (order.total_amount + order.voucher_amount).toLocaleString('vi', {
                                            style:
                                                'currency', currency: 'VND'
                                        }) }}</h4>
                                    </td>
                                </tr>
                                <tr class="amount-small" v-if="order.voucher_amount">
                                    <td>
                                        <p>Tiền giảm:</p>
                                    </td>
                                    <td>
                                        <h4>{{ order.voucher_amount.toLocaleString('vi', {
                                            style: 'currency', currency:
                                                'VND'
                                        })
                                        }}</h4>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>Tổng tiền:</p>
                                    </td>
                                    <td>
                                        <h4>{{ order.total_amount.toLocaleString('vi', {
                                            style: 'currency', currency: 'VND'
                                        })
                                        }}</h4>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <hr>
                    </div>
                </section>
            </div>
            <div class="box-pdf-btn">
                <button @click="exportToPDF">Xuất hóa đơn</button>
                <button @click="printInvoid" class="btn-print">In hóa đơn</button>
                <button @click="close">Hủy</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.box-order-detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000073;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Poppins", Arial, sans-serif !important;
}

.order-detail-table {
    padding: 1em;
    background-color: white;
    height: calc(100% - 2em);
    overflow-y: scroll;
}

.box-pdf {
    padding: 0 1em;
}

.box-pdf span {
    display: flex;
    margin-top: 0.5em;
    justify-content: flex-end;
}

.box-pdf span p {
    margin-right: 0.5em;
}


.box-pdf table td {
    padding: 10px 15px;
    font-size: 13px;
}

.order-detail-table button {
    border-radius: 3px;
    cursor: pointer;
    margin-top: 1em;
    background-color: white;
    border: 1px solid black;
    padding: 0.5em 1em;
}

img.img-logo-bill {
    height: 2em;
    background-color: green;
    padding: 10px;
}

.box-pdf-top {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: end;
    grid-gap: 1em;
}

.box-pd-border {
    padding: 0.5em;
    border: 1px solid black;
}

.box-pdf-info {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 2em;
    margin-bottom: 1em;
}

table {
    width: 100%;
}

thead {
    border-bottom: 2px solid black;
    border-top: 2px solid black;
}

thead th {
    padding: 0.5em;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 13px;
}

table td:nth-child(1),
table td:nth-child(5),
table td:nth-child(3) {
    text-align: center;
}

table,
th,
td {
    border: 0px solid gray;
    border-collapse: collapse;
}

.table-bottom table,
.table-bottom th,
.table-bottom td {
    border: 0px solid gray;
    border-collapse: collapse;
    text-align: right;
    padding: 3px !important;
}

.box-pdf-info-left {
    padding-right: 2em;
}

hr {
    margin-top: 1em;
}

.box-pdf span {
    font-size: 20px;
    font-style: italic;
    color: #850202;
}

.order-detail-table .box-pdf-btn button:first-child {
    background-color: #4242ff;
    color: white;
}

span.amount-small {
    margin: 0;
    margin-top: 0.5em;
}

span.amount-small p,
span.amount-small h4 {
    font-size: 16px;
    color: black;
    font-style: normal;
}

.table-bottom table tr:last-child {
    font-size: 16px;
}

.table-bottom table tr:last-child h4 {
    color: #850202;
}

.table-bottom {
    margin-left: 50%;
    margin-top: 1em;
}

p.title-invoice {
    font-size: 35px;
    text-transform: uppercase;
    letter-spacing: 3px;
}

.table-bottom td {
    font-size: 18px !important;
}

.box-pdf-top-invoi-info-child {
    display: inline-block;
    text-align: center;
    margin-bottom: 1em;
}

table.info-customer-and-admin,
table.info-customer-and-admin th,
table.info-customer-and-admin td {
    border: 0px solid gray;
    border-collapse: collapse;
    text-align: left;
    padding: 0px !important;
}

table.info-customer-and-admin {
    margin-bottom: 1em;
}

.table-bottom p {
    text-align: right;
    font-weight: bold;
}

table.table-product {
    border-bottom: 2px solid black;
}

.box-pdf-top p {
    font-size: 13px;
}

button.btn-print {
    margin: 0 2em;
    background-color: #615721 !important;
    color: white;
}

.box-pdf-btn button {
    text-transform: uppercase;
    letter-spacing: 1px;
}

</style>
