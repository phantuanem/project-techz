document.addEventListener("DOMContentLoaded", function () {
    var list = document.querySelectorAll('.item')
    var list_delete = document.querySelectorAll('img.delete-item')
    var list = document.querySelectorAll('.container .box .item')
    var input_code_voucher = document.querySelector('#input-code-voucher')
    var check_code_voucher = ''

    list_delete.forEach(item => {
        item.onclick = () => {
            let loader = document.querySelector('.loader')
            loader.classList.remove('loader-hidden')
            fetch(`/api/cart?id=${item.dataset.id}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        list.forEach(item_product => {
                            if (item_product.querySelector('img.delete-item').dataset.id == item.dataset.id) {
                                let sum_price = document.querySelector('#sum-price')
                                var sum = (JSON.parse(sum_price.innerText.replace(/[^\d]/g, '')) - JSON.parse(item_product.querySelector('.sale-price').innerText.replace(/[^\d]/g, '')))
                                sum_price.innerText = sum.toLocaleString('vi', { style: 'currency', currency: 'VND' })
                                item_product.remove()
                                document.querySelector('#title-card span').textContent = JSON.parse(document.querySelector('#title-card span').textContent) - 1
                                if (sum == 0) {
                                    console.log('hihi')
                                    document.querySelector('.container').innerHTML += `<div class="title-cart-empty">
                                                                                            <p>Giỏ hàng trống</p>
                                                                                            <a href="/">Tiếp tục mua hàng</a>
                                                                                        </div>`
                                    document.querySelector('.container .box').innerHTML = ''
                                    document.querySelector('.container form').innerHTML = ''
                                }
                            }
                        })
                    }
                    loader.classList.add('loader-hidden')
                })
                .catch(error => console.error(error));
        }
    })

    list.forEach(item => {
        let btn_plus = item.querySelector('#icon-plus')
        let btn_minus = item.querySelector('#icon-minus')
        btn_plus.onclick = () => {
            let quantity = JSON.parse(item.querySelector('.quantity p').textContent)
            fetch(`/api/cart-item/increase?quantity=${quantity}&id_cart_item=${item.dataset.id_cart_item}`)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        quantity++
                        item.querySelector('.quantity p').textContent = quantity
                        updateSumPrice(list, document.querySelector('#sum-price'))
                    }
                })
                .catch(error => console.error(error));
        }

        btn_minus.onclick = () => {
            let quantity = JSON.parse(item.querySelector('.quantity p').textContent)
            if (quantity > 1) {
                fetch(`/api/cart-item/reduce?quantity=${quantity}&id_cart_item=${item.dataset.id_cart_item}`)
                    .then(response => response.json())
                    .then(data => {
                        quantity--
                        item.querySelector('.quantity p').textContent = quantity
                        updateSumPrice(list, document.querySelector('#sum-price'))
                    })
                    .catch(error => console.error(error));
            }
        }
    })

    if (input_code_voucher) {
        input_code_voucher.addEventListener('click', () => {
            check_code_voucher = input_code_voucher.value
        });

        input_code_voucher.addEventListener('blur', () => {
            if (input_code_voucher.value.length >= 5 && check_code_voucher != input_code_voucher.value) {
                fetch(`/api/voucher?voucher_code=${input_code_voucher.value}`)
                    .then(response => response.json())
                    .then(amount => {
                        if (amount) {
                            let sum_price = document.querySelector('#sum-price')
                            sum_price.innerText = (JSON.parse(sum_price.innerText.replace(/[^\d]/g, '')) - amount).toLocaleString('vi', { style: 'currency', currency: 'VND' })
                        }
                    })
                    .catch(error => console.error(error));
            }
        });
    }
})

function updateSumPrice(list, element_sum_price) {
    var sum = 0
    list.forEach(item => {
        var quantoty = JSON.parse(item.querySelector('.quantity p').textContent)
        var price = JSON.parse(item.querySelector('.sale-price').textContent.replace(/[^\d]/g, ''))
        sum += quantoty * price
    })
    element_sum_price.innerText = sum.toLocaleString('vi', { style: 'currency', currency: 'VND' })
}