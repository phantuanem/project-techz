document.addEventListener('DOMContentLoaded', function () {
    var img_product = document.querySelector('.img-product')
    var btn_add_to_card = document.querySelector('#add-to-card')
    var btn_buy = document.querySelector('#btn-buy')
    img_product.onload = () => {
        img_product.style = 'aspect-ratio:' + img_product.clientHeight + ' / ' + img_product.clientWidth

    }
    document.querySelector('.box-image-smaill').addEventListener('wheel', function (event) {
        var box_images = document.querySelector('.box-image-smaill')
        event.preventDefault();
        if (event.deltaY > 0) {
            box_images.scrollLeft += 20
        } else if (event.deltaY < 0) {
            box_images.scrollLeft += -20
        }
    })

    var list_image_small = document.querySelectorAll('.box-image-smaill ul li')
    list_image_small.forEach(li => {
        li.onclick = () => {
            list_image_small.forEach(li2 => {
                li2.classList.remove('li-select')
            })
            li.classList.add('li-select')
            img_product.setAttribute('src', li.querySelector('img').src)
        }
    })

    btn_add_to_card.onclick = () => {
        if (document.querySelectorAll('.form-login').length > 0) {
            document.querySelector('.container-form').classList.remove('container-form-hidden')
        } else {
            const data = { id: JSON.parse(btn_add_to_card.dataset.id) };

            fetch('/api/card/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        document.querySelector('#title-card span').textContent = JSON.parse(document.querySelector('#title-card span').textContent) + 1
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }

    btn_buy.onclick = (event) => {
        if (document.querySelectorAll('.form-login').length > 0) {
            document.querySelector('.container-form').classList.remove('container-form-hidden')
        } else {
            const data = { id: JSON.parse(btn_add_to_card.dataset.id) };

            fetch('/api/card/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        window.open('/cart', '_self')
                    }
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }
})