<script>
import axios from 'axios'
export default {
    name: 'FormAddress',
    props: ['onChangeFormUpdateAddress'],
    methods: {
        renderCity(data) {
            var citis = document.getElementById("city");
            var districts = document.getElementById("district");
            var wards = document.getElementById("ward");
            for (const x of data) {
                var opt = document.createElement('option');
                opt.value = x.Name;
                opt.text = x.Name;
                opt.setAttribute('data-id', x.Id);
                citis.options.add(opt);
            }
            citis.onchange = function () {
                district.length = 1;
                ward.length = 1;
                if (this.options[this.selectedIndex].dataset.id != "") {
                    const result = data.filter(n => n.Id === this.options[this.selectedIndex].dataset.id);

                    for (const k of result[0].Districts) {
                        var opt = document.createElement('option');
                        opt.value = k.Name;
                        opt.text = k.Name;
                        opt.setAttribute('data-id', k.Id);
                        district.options.add(opt);
                    }
                }
            };
            district.onchange = function () {
                ward.length = 1;
                const dataCity = data.filter((n) => n.Id === citis.options[citis.selectedIndex].dataset.id);
                if (this.options[this.selectedIndex].dataset.id != "") {
                    const dataWards = dataCity[0].Districts.filter(n => n.Id === this.options[this.selectedIndex].dataset.id)[0].Wards;

                    for (const w of dataWards) {
                        var opt = document.createElement('option');
                        opt.value = w.Name;
                        opt.text = w.Name;
                        opt.setAttribute('data-id', w.Id);
                        wards.options.add(opt);
                    }
                }
            };
            wards.onchange = () => {
                this.onChangeFormUpdateAddress({
                    city: citis.value,
                    district: districts.value,
                    ward: wards.value
                })
            }
        }
    },
    async created() {
        try {
            var response = await axios.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
            this.data_address = response.data
            this.renderCity(response.data)
        } catch (e) {
            console.log(e)
        }
    },
}
</script>

<template>
    <div class="form-update-address">
        <label for="">Địa chỉ</label>
        <select id="city">
            <option value="" selected>Chọn tỉnh thành</option>
        </select>

        <select id="district">
            <option value="" selected>Chọn quận huyện</option>
        </select>

        <select id="ward">
            <option value="" selected>Chọn phường xã</option>
        </select>
    </div>
</template>

<style scoped>
.form-update-address select {
    font-size: 1em;
    padding: 8px;
    display: block;
    margin: 0.5em 0;
    margin-left: 2em;
    cursor: pointer;
}
</style>
