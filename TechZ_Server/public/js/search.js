document.addEventListener("DOMContentLoaded", function(){
    var btnMNore = document.querySelector('#more-product')

    btnMNore.onclick = async () => {
        let list = document.querySelectorAll('.thumbnail')
        let productID = list[list.length - 1].dataset.id
        fetch(`/api/search?productID=${productID}&search=${document.querySelector('#input-search').value}`)
            .then(response => response.json())
            .then(data => {
                let container = document.querySelector('.container')
                for(let product of data.list){
                     container.innerHTML += `<a href="/product/${product.id}">
                                                <div class="thumbnail" data-id="${product.id}">
                                                    <img src="${product.url}" alt="">
                                                    <h4 class="name">${product.name}</h4>
                                                    ${
                                                        product.price != 0 ? `<del class="price">${product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</del>`:''
                                                    }
                                                    <div class="sale_price">
                                                        <p>${product.sale_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
                                                        ${
                                                            product.price != 0 ? `<span>${((1 - (product.sale_price / product.price)).toFixed(2) * 100).toFixed(0)}%</span>`:''
                                                        }
                                                    </div>
                                                </div>
                                            </a>`
                    if(data.count <= 0){
                        btnMNore.textContent = 'Xem thêm 0'
                        btnMNore.setAttribute('style', 'display: none')
                    } else {
                        btnMNore.textContent = 'Xem thêm ' + data.count
                    }
                }
            })
            .catch(error => console.error(error));
    }
})