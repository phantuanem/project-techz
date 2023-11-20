<script>
import axios from 'axios'
export default {
    name: 'DetailPropduct',
    props: ['product_id_select'],
    data() {
        return {
            product: {}
        }
    },
    methods: {
        async getDetailProduct() {
            try {
                let response = await axios.get('/admin/manage/detail', {
                    params: {
                        productID: this.product_id_select
                    }
                })
                this.product = response.data
            } catch (e) {
                console.log(e)
            }
        },
        returnContent(content) {
            var str = ''
            for (let i = 0; i < content.length - 2; i++) {
                str += content[i] + '/n'
            }
            str += content[content.length - 1]
            return str
        },
        closeFormDetail(){
            this.$parent.product_id_select = ''
        }
    },
    created() {
        this.getDetailProduct()
    }
}
</script>

<template>
    <div class="box-detail" v-if="product.name">
        <div class="box-detail-child">
            <img src="../../assets/icon/wrong_delete_remove_trash_minus_icon.png" alt="" class="img-icon-close" @click="closeFormDetail">
            <p class="title-detail">Thông tin sản phẩm</p>
            <div class="box-detail-child-scroll">
                <span>
                    <p>Danh mục</p>
                    <p>{{ product.category_name }}</p>
                </span>
                <span>
                    <p>Thương hiệu</p>
                    <p>{{ product.brand_name }}</p>
                </span>
                <span>
                    <p>Tên SP</p>
                    <p>{{ product.name }}</p>
                </span>
                <span>
                    <p>Giá niêm yết</p>
                    <p>{{ product.price.toLocaleString('vi', { style: 'currency' , currency: 'VND' }) }}</p>
                </span>
                <span>
                    <p>Giá bán</p>
                    <p>{{ product.sale_price.toLocaleString('vi', { style: 'currency' , currency: 'VND' }) }}</p>
                </span>
                <span>
                    <p>Bảo hành</p>
                    <p>{{ product.quarranty_period }} tháng</p>
                </span>
                <span>
                    <p>Số lượng</p>
                    <p>{{ product.quantity }}</p>
                </span>
                <div class="box-image-in-detail">
                    <img v-for="(url, i) in product.urls" :src="url" :key="i" alt="">
                </div>
                <p class="title-info">Thông số kỹ thuật ngắn</p>
                <span v-for="(item, i) in product.desc_short" :key="i">
                    <p>{{ item.title }}</p>
                    <p>{{ item.content }}</p>
                </span>
                <p class="title-info">Thông số kỹ thuật đầy đủ</p>
                <table>
                    <tr v-for="(item, i) in product.info" :key="i">
                        <td>
                            <p>{{ item.title }}</p>
                        </td>
                        <td>
                            <p>{{ returnContent(item.context) }}</p>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.box-detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0000004f;
    display: flex;
    align-items: center;
    justify-content: center;
}

.box-detail-child {
    width: 60%;
    height: 80%;
    background-color: white;
    position: relative;
    padding: 1em;
}

img.img-icon-close {
    width: 1.5em;
    cursor: pointer;
    border-radius: 50%;
    position: absolute;
    right: 0.5em;
    top: 0.5em;
}

p.title-detail {
    text-align: center;
    font-size: 22px;
}

.box-detail-child span {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin: 8px 0px;
}

.box-detail-child span p {
    font-size: 1em;
}

.box-detail-child span p:first-child {
    width: 8em;
}

.box-detail-child-scroll {
    overflow-y: scroll;
    height: calc(100% - 2em);
}

.box-image-in-detail {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
}

.box-image-in-detail img {
    width: 100%;
}
.box-detail-child table,
.box-detail-child th,
.box-detail-child td {
    border: 1px solid gray;
    border-collapse: collapse;
}

.box-detail-child th,
.box-detail-child td {
   padding: 5px;
}

.box-detail-child table tr td:first-child {
    font-weight: bold;
}

</style>
