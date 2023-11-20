<script>
import Nav from '../components/nav.vue'
import { mapState } from 'vuex';
import axios from 'axios'
import { setTransitionHooks } from 'vue';
export default {
    name: 'PostProduct',
    data() {
        return {
            name_category: '',
            name: '',
            brandID: '',
            price: '',
            sale_price: '',
            quantity: '',
            quarranty_period: '',
            products: [
                {
                    slug: 'laptop',
                    desc: [
                        {
                            title: 'CPU',
                            content: ''
                        },
                        {
                            title: 'RAM',
                            content: ''
                        },
                        {
                            title: 'Ổ cứng',
                            content: ''
                        },
                        {
                            title: 'VGA',
                            content: ''
                        },
                        {
                            title: 'Màn hình',
                            content: ''
                        },
                        {
                            title: 'Cổng giao tiếp',
                            content: ''
                        },
                        {
                            title: 'Bàn phím',
                            content: ''
                        },
                        {
                            title: 'Bảo mật',
                            content: ''
                        },
                        {
                            title: 'Audio',
                            content: ''
                        },
                        {
                            title: 'Đọc thẻ nhớ',
                            content: ''
                        },
                        {
                            title: 'NumberPad',
                            content: ''
                        },
                        {
                            title: 'Led-Keyboard',
                            content: ''
                        },
                        {
                            title: 'Chuẩn LAN',
                            content: ''
                        },
                        {
                            title: 'Chuẩn WIFI',
                            content: ''
                        },
                        {
                            title: 'Bluetooth',
                            content: ''
                        },
                        {
                            title: 'Webcam',
                            content: ''
                        },
                        {
                            title: 'Hệ điều hành',
                            content: ''
                        },
                        {
                            title: 'Pin',
                            content: ''
                        },
                        {
                            title: 'Trọng lượng',
                            content: ''
                        },
                        {
                            title: 'Màu sắc',
                            content: ''
                        },
                        {
                            title: 'Kích thước',
                            content: ''
                        }
                    ],
                    desc_short: [
                        {
                            title: 'CPU',
                            content: ''
                        },
                        {
                            title: 'SSD',
                            content: ''
                        },
                        {
                            title: 'VGA',
                            content: ''
                        },
                        {
                            title: 'RAM',
                            content: ''
                        },
                        {
                            title: 'Kích thước màn hình',
                            content: ''
                        }
                    ]
                },
                {
                    slug: 'monitor',
                    desc: [
                        {
                            title: 'Thương hiệu',
                            content: ''
                        },
                        {
                            title: 'Kích thước',
                            content: ''
                        },
                        {
                            title: 'Độ phân giải',
                            content: ''
                        },
                        {
                            title: 'Tấm nền',
                            content: ''
                        },
                        {
                            title: 'Tần số quét',
                            content: ''
                        },
                        {
                            title: 'Thời gian phản hồi',
                            content: ''
                        },
                        {
                            title: 'Kiểu màn hình (phẳng/cong)',
                            content: ''
                        },
                        {
                            title: 'Độ sáng',
                            content: ''
                        },
                        {
                            title: 'Góc nhìn',
                            content: ''
                        },
                        {
                            title: 'Khả năng hiển thị màu sắc',
                            content: ''
                        },
                        {
                            title: 'Độ tương phản',
                            content: ''
                        },
                        {
                            title: 'Cổng xuất hình',
                            content: ''
                        },
                        {
                            title: 'Tính năng đặc biệt',
                            content: ''
                        },
                        {
                            title: 'Tiêu thụ điện',
                            content: ''
                        },
                        {
                            title: 'Kích thước chuẩn',
                            content: ''
                        },
                        {
                            title: 'Trọng lượng',
                            content: ''
                        },
                        {
                            title: 'Phụ kiện đi kèm',
                            content: ''
                        }
                    ],
                    desc_short: [
                        {
                            title: 'Tấm nền',
                            content: ''
                        },
                        {
                            title: 'Trọng lượng',
                            content: ''
                        },
                        {
                            title: 'Điện năng tiêu thụ',
                            content: ''
                        },
                        {
                            title: 'Kích thước',
                            content: ''
                        },
                        {
                            title: 'Kiểu màn hình(phẳng/cong)',
                            content: ''
                        },
                        {
                            title: 'Độ phân giải',
                            content: ''
                        },
                        {
                            title: 'Trọng lượng',
                            content: ''
                        },
                        {
                            title: 'Độ sáng',
                            content: ''
                        }
                    ]
                },
                {
                    slug: 'keyboard',
                    desc: [
                        {
                            title: 'Thiết kế',
                            content: ''
                        },
                        {
                            title: 'Kết nối',
                            content: ''
                        },
                        {
                            title: 'Pin',
                            content: ''
                        },
                        {
                            title: 'LED',
                            content: ''
                        },
                        {
                            title: 'Hỗ trợ',
                            content: ''
                        },
                        {
                            title: 'Kích thước',
                            content: ''
                        },
                        {
                            title: 'Trọng lượng',
                            content: ''
                        },
                        {
                            title: 'Vỏ case',
                            content: ''
                        },
                        {
                            title: 'Keycap',
                            content: ''
                        },
                        {
                            title: 'Switch',
                            content: ''
                        },
                        {
                            title: 'Stab pre-lubed',
                            content: ''
                        },
                        {
                            title: 'Phụ kiện',
                            content: ''
                        },
                        {
                            title: 'Foam tiêu âm',
                            content: ''
                        },
                        {
                            title: 'Tương thích',
                            content: ''
                        },
                        {
                            title: 'Thương hiệu',
                            content: ''
                        },
                        {
                            title: 'Series/Model',
                            content: ''
                        },
                        {
                            title: 'Layout',
                            content: ''
                        },
                        {
                            title: 'Màu sắc',
                            content: ''
                        },
                        {
                            title: 'Tương thích',
                            content: ''
                        }
                    ],
                    desc_short: [
                        {
                            title: 'Màu sắc',
                            content: ''
                        },
                        {
                            title: 'Keycap',
                            content: ''
                        },
                        {
                            title: 'Model',
                            content: ''
                        },
                        {
                            title: 'Thiết kế',
                            content: ''
                        },
                        {
                            title: 'Switch',
                            content: ''
                        },
                        {
                            title: 'Hãng',
                            content: ''
                        },
                        {
                            title: 'Pin',
                            content: ''
                        }
                    ]
                },
                {
                    slug: 'headphone',
                    desc: [
                        {
                            title: 'Thương hiệu',
                            content: ''
                        },
                        {
                            title: 'Series/Model',
                            content: ''
                        },
                        {
                            title: 'Màu sắc',
                            content: ''
                        },
                        {
                            title: 'Trọng lượng',
                            content: ''
                        },
                        {
                            title: 'Kích thước',
                            content: ''
                        },
                        {
                            title: 'Driver',
                            content: ''
                        },
                        {
                            title: 'Kết nối',
                            content: ''
                        },
                        {
                            title: 'LED',
                            content: ''
                        },
                        {
                            title: 'Phạm vi kết nối',
                            content: ''
                        },
                        {
                            title: 'Pin',
                            content: ''
                        },
                        {
                            title: 'Phụ kiện đi kèm',
                            content: ''
                        },
                        {
                            title: 'Độ nhạy tần số',
                            content: ''
                        },
                        {
                            title: 'Trở kháng',
                            content: ''
                        },
                        {
                            title: 'Độ nhạy',
                            content: ''
                        }
                    ],
                    desc_short: [
                        {
                            title: 'Chuẩn kết nối',
                            content: ''
                        },
                        {
                            title: 'Kết nối',
                            content: ''
                        },
                        {
                            title: 'Thương hiệu',
                            content: ''
                        },
                        {
                            title: 'Màu sắc',
                            content: ''
                        }
                    ]
                },
                {
                    slug: 'mouse',
                    desc: [
                        {
                            title: 'Model',
                            content: ''
                        },
                        {
                            title: 'Màu sắc',
                            content: ''
                        },
                        {
                            title: 'Thiết kế',
                            content: ''
                        },
                        {
                            title: 'Kết nối',
                            content: ''
                        },
                        {
                            title: 'LED',
                            content: ''
                        },
                        {
                            title: 'Cảm biến',
                            content: ''
                        },
                        {
                            title: 'DPI',
                            content: ''
                        },
                        {
                            title: 'IPS',
                            content: ''
                        },
                        {
                            title: 'Gia tốc tối đa(G)',
                            content: ''
                        },
                        {
                            title: 'Số nút',
                            content: ''
                        },
                        {
                            title: 'Switch',
                            content: ''
                        },
                        {
                            title: 'Tuổi thọ Switch',
                            content: ''
                        },
                        {
                            title: 'Feet chuột',
                            content: ''
                        },
                        {
                            title: 'Thời lượng pin',
                            content: ''
                        },
                        {
                            title: 'Kích thước (D x R x C)',
                            content: ''
                        },
                        {
                            title: 'Trọng lượng',
                            content: ''
                        }
                    ],
                    desc_short: [
                        {
                            title: 'Màu sắc',
                            content: ''
                        },
                        {
                            title: 'Thiết kế',
                            content: ''
                        },
                        {
                            title: 'Kết nối',
                            content: ''
                        }
                    ]
                },
                {
                    slug: 'mousepad',
                    desc: [
                        {
                            title: 'Model',
                            content: ''
                        },
                        {
                            title: 'Chống trượt',
                            content: ''
                        },
                        {
                            title: 'Size',
                            content: ''
                        },
                        {
                            title: 'Kích thước',
                            content: ''
                        },
                        {
                            title: 'Chất liệu',
                            content: ''
                        },
                        {
                            title: 'Bề mặt',
                            content: ''
                        },
                        {
                            title: 'Led',
                            content: ''
                        }
                    ],
                    desc_short: [
                    ]
                }
            ],
            desc: [],
            desc_short: [],
            images: [],
            loading: false
        }
    },
    methods: {
        async getInfoProduct() {
            try {
                let response = await axios.get('/admin/upload/info', {
                    params: {
                        slug: this.$route.params.slug
                    }
                })
            } catch (e) {
                console.log(e)
            }
        },
        uploadImages() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.addEventListener('change', this.handleFileUpload);
            fileInput.click();
        },
        async handleFileUpload(event) {
            const files = event.target.files;
            let images = [];
            for (let i = 0; i < files.length; i++) {
                let img = await this.processImage(files[i]);
                this.images.push(img)
            }
        },
        async processImage(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();

                reader.onload = function (event) {
                    const imageURL = event.target.result;
                    resolve(imageURL);
                };

                reader.readAsDataURL(file);
            });
        },
        removeImage(img) {
            this.images.forEach((item, i) => {
                if (item == img) this.images.splice(i, 1)
            })
        },
        async uploadProduct() {
            this.loading = true
            var categoryID = 0
            this.$store.state.nav.category.forEach(ct => {
                if (ct.slug == this.$route.params.slug) {
                    categoryID = ct.id
                }
            })
            let product = {
                categoryID: categoryID,
                brandID: this.brandID,
                name: this.name,
                price: this.price,
                sale_price: this.sale_price,
                quantity: this.quantity,
                quarranty_period: this.quarranty_period
            }
            var response = await axios.post('/admin/product/upload', {
                product: product,
                images: this.images,
                desc: this.desc,
                desc_short: this.desc_short
            })
            this.name = ''
            this.brandID = ''
            this.price = '',
                this.sale_price = ''
            this.quantity = ''
            this.quarranty_period = ''
            this.images = []
            this.desc.forEach(de => {
                de.content = ''
            })
            this.desc_short.forEach(de => {
                de.content = ''
            })
            this.loading = false
        }
    },
    created() {
        document.title = "Đăng sản phẩm";
        this.category.forEach(cate => {
            if (cate.slug == this.$route.params.slug) {
                this.name_category = cate.name
            }
        })
        this.products.forEach(product => {
            if (product.slug == this.$route.params.slug) {
                this.desc = product.desc
                this.desc_short = product.desc_short
            }
        })
    },
    computed: {
        ...mapState('nav', ['category', 'brands'])
    },
    watch: {
        '$route': function () {
            this.category.forEach(cate => {
                if (cate.slug == this.$route.params.slug) {
                    this.name_category = cate.name
                }
            })
            this.products.forEach(product => {
                if (product.slug == this.$route.params.slug) {
                    this.desc = product.desc
                    this.desc_short = product.desc_short
                }
            })
        }
    },
    components: {
        Nav
    }
}
</script>

<template>
    <div class="container">
        <Nav />
        <div class="box">
            <h3>Đăng sản phẩm {{ name_category }}</h3>
            <div class="row">
                <h4>Thương hiệu</h4>
                <select name="" id="" v-model="brandID">
                    <option value="">Thương hiệu</option>
                    <option v-for="(brand, i) in brands" :value="brand.id">{{ brand.name }}</option>
                </select>
            </div>
            <div class="row row-name-product">
                <p>Tên sản phẩm</p>
                <textarea v-model="name"></textarea>
            </div>
            <div class="row-block">
                <div class="row">
                    <p>Giá niêm yết (VNĐ)</p>
                    <textarea v-model="price"></textarea>
                </div>
                <div class="row">
                    <p>Giá bán lẻ (VNĐ)</p>
                    <textarea v-model="sale_price"></textarea>
                </div>
                <div class="row">
                    <p>Số lượng trong kho</p>
                    <textarea v-model="quantity"></textarea>
                </div>
                <div class="row">
                    <p>Thời gian bảo hành (tháng)</p>
                    <textarea v-model="quarranty_period"></textarea>
                </div>
            </div>
            <div id="btn-upload-image" @click="uploadImages">Tải ảnh <img
                    src="../assets/icon/image_photo_picture_gallery_icon.png" alt="" class="img-icon"></div>
            <div class="box-image">
                <div class="box-image-child" v-for="(image, i) in images" :key="i" @click="removeImage(image)">
                    <img src="../assets//icon/wrong_delete_remove_trash_minus_icon.png" alt="" class="img-icon-close">
                    <img :src="image" alt="">
                </div>
            </div>
            <form action="" @submit.prevent="uploadProduct">
                <p class="title">Thông số kỹ thuật</p>
                <div class="box-child">
                    <div class="input-group" v-for="(item, i) in desc" :key="i">
                        <label for="">{{ item.title }}</label>
                        <textarea rows="5" v-model="item.content"></textarea>
                    </div>
                </div>
                <p class="title" v-show="desc_short.length > 0">Thông số kỹ thuật ngắn gọn</p>
                <div class="box-child">
                    <div class="input-group" v-for="(item, i) in desc_short" :key="i">
                        <label for="">{{ item.title }}</label>
                        <textarea rows="5" v-model="item.content"></textarea>
                    </div>
                </div>
                <button>Đăng sản phẩm</button>
            </form>
        </div>
        <div class="loading" v-show="loading">
            <div></div>
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
    font-family: 'Open Sans', sans-serif;
}

.box {
    width: calc(100% - 0.5em);
    height: calc(100% - 1em);
    overflow-y: scroll;
    padding: 0.5em 0;
    padding-right: 0.5em;
}

.row input {
    font-size: 18px;
    padding: 5px 10px;
    margin-bottom: 0.5em;
    outline: none;
}

.box h3 {
    margin-bottom: 1em;
    text-align: center;
    text-transform: uppercase;
    font-weight: normal;
}

.input-group label {
    width: 9em;
    margin-right: 1em;
}

.input-group input {
    outline: none;
    border: 1px solid #585858;
    padding: 6px 10px;
    border-radius: 3px;
    width: calc(100% - 10em);
}

form button {
    font-size: 1em;
    font-weight: bold;
    padding: 10px 2em;
    margin-top: 1em;
    cursor: pointer;
    border: none;
    background-color: #6464ff;
    color: white;
    border-radius: 3px;
}

p.title {
    padding: 10px;
    font-weight: bold;
    background-color: #c6b5a9;
    margin-top: 2em;
    margin-bottom: 1em;
}

.box-child {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1em;
}

#btn-upload-image img.img-icon {
    height: 1.5em;
    margin-left: 8px;
}

#btn-upload-image {
    display: flex;
    align-items: center;
    background-color: white;
    color: black;
    border: 1px solid black;
    width: 10em;
    padding: 0.5em;
    justify-content: center;
    cursor: pointer;
}

.box-image {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    width: 100%;
}

.box-image-child img.img-icon-close {
    width: 1.5em;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    top: 0%;
    right: 0;
}

.box-image-child img {
    width: 100%;
}

.box-image-child {
    position: relative;
}

select {
    font-size: 1em;
    padding: 7px 1em;
    margin-top: 5px;
    margin-bottom: 0.5em;
    cursor: pointer;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000063;
}

.loading div {
    width: 2em;
    height: 2em;
    border: 5px solid white;
    border-radius: 50%;
    border-top: 5px solid gray;
    animation: spinner 0.5s infinite linear;
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.row {
    position: relative;
    margin: 1em 0;
}

.row textarea {
    min-height: 3em;
    border: 2px solid #b3b3e7;
    border-radius: 0.5em;
    min-width: 15em;
    padding: 1em;
}

.row p {
    background-color: white;
    height: 1.5em;
    top: -0.75em;
    z-index: 1;
    position: absolute;
    left: 0.75em;
    padding: 0 10px;
    font-size: 15px;
    color: #393939;
}

.row-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.row-block .row {
    margin-right: 1em;
    flex-grow: 1;
}

.row-block .row textarea {
    width: calc(100% - 2em - 4px);
    min-width: auto;
}

.row-block .row:last-child {
    margin-right: 0em;
}

.row.row-name-product textarea {
    width: calc(100% - 2em - 4px);
    min-width: auto;
}

.box-child textarea {
    padding: 1em;
    width: calc(100% - 2em - 2px);
    border-radius: 0.5em;
}

</style>
