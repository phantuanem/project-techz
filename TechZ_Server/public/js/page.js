document.addEventListener("DOMContentLoaded", function () {
    closeAllSelect()
    var btnMNore = document.querySelector('#more-product')

    // Lấy tất cả các thẻ div có class là "select-selected"
    var selectSelectedList = document.querySelectorAll('.select-selected');

    // Tạo một đối tượng MutationObserver
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // Xử lý sự thay đổi nội dung của từng phần tử
            filterLAptop(selectSelectedList)
        });
    });

    // Đặt các tùy chọn cho MutationObserver
    var observerConfig = {
        childList: true, // Lắng nghe sự thay đổi trong các phần tử con
        subtree: true, // Lắng nghe sự thay đổi trong toàn bộ cây con
        characterData: true // Lắng nghe sự thay đổi trong dữ liệu ký tự
    };

    // Gắn MutationObserver cho từng phần tử trong danh sách
    selectSelectedList.forEach(function (selectSelected) {
        observer.observe(selectSelected, observerConfig);
    });

    btnMNore.onclick = async () => {
        let list = document.querySelectorAll('.thumbnail')
        let productID = list[list.length - 1].dataset.id
        fetch(`/api/page/${btnMNore.dataset.category}/${btnMNore.dataset.brand}?productID=${productID}`)
            .then(response => response.json())
            .then(data => {
                let container = document.querySelector('.container')
                for (let product of data.list) {
                    container.innerHTML += `<a href="/product/${product.id}">
                                                <div class="thumbnail" data-id="${product.id}">
                                                    <img src="${product.url}" alt="">
                                                    <h4 class="name">${product.name}</h4>
                                                    ${product.price != 0 ? `<del class="price">${product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</del>` : ''
                        }
                                                    <div class="sale_price">
                                                        <p>${product.sale_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
                                                        ${product.price != 0 ? `<span>${((1 - (product.sale_price / product.price)).toFixed(2) * 100).toFixed(0)}%</span>` : ''
                        }
                                                    </div>
                                                </div>
                                            </a>`
                    if (data.count <= 0) {
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

var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName("select")[0];
    ll = selElmnt.length;
    /*for each element, create a new DIV that will act as the selected item:*/
    a = document.createElement("DIV");
    a.setAttribute("class", "select-selected");
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /*for each element, create a new DIV that will contain the option list:*/
    b = document.createElement("DIV");
    b.setAttribute("class", "select-items select-hide");
    for (j = 1; j < ll; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;
        c.addEventListener("click", function (e) {
            /*when an item is clicked, update the original select box,
            and the selected item:*/
            var y, i, k, s, h, sl, yl;
            s = this.parentNode.parentNode.getElementsByTagName("select")[0];
            sl = s.length;
            h = this.parentNode.previousSibling;
            for (i = 0; i < sl; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                    s.selectedIndex = i;
                    h.innerHTML = this.innerHTML;
                    y = this.parentNode.getElementsByClassName("same-as-selected");
                    yl = y.length;
                    for (k = 0; k < yl; k++) {
                        y[k].removeAttribute("class");
                    }
                    this.setAttribute("class", "same-as-selected");
                    break;
                }
            }
            h.click();
        });
        b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener("click", function (e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
    except the current select box:*/
    var x, y, i, xl, yl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
        }
    }
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
        }
    }
}

async function filterLAptop(selectSelectedList) {
    var option = []
    selectSelectedList.forEach(item => {
        var op = {
            option: item.parentNode.dataset.option,
            value: 0
        }
        var str = item.textContent;
        var number = str.replace(/\D/g, "");
        if (number) {
            var str = item.textContent;
            var number = parseFloat(str.match(/\d+(\.\d+)?/));
            if (number) {
                op.value = number
            }
        }
        option.push(op)
    })

    // Tạo query string từ mảng options
    var queryString = option.map(function (option) {
        return encodeURIComponent(option.option) + '=' + encodeURIComponent(option.value);
    }).join('&');
    const locationHref = location.href;

    // Tách chuỗi thành mảng các phần tử dựa trên dấu '/'
    const parts = locationHref.split('/');

    // Lấy phần tử cuối cùng trong mảng parts
    const lastPart = parts.pop();

    // Tạo URL mới với query string
    var url = '/api/filter' + '?' + queryString + '&brandID=' + lastPart;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let container = document.querySelector('.container')
            container.innerHTML = ''
            var btnMNore = document.querySelector('#more-product')
            for (let product of data.list) {
                container.innerHTML += `<a href="/product/${product.id}">
                                        <div class="thumbnail" data-id="${product.id}">
                                            <img src="${product.url}" alt="">
                                            <h4 class="name">${product.name}</h4>
                                            ${product.price != 0 ? `<del class="price">${product.price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</del>` : ''
                    }
                                            <div class="sale_price">
                                                <p>${product.sale_price.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
                                                ${product.price != 0 ? `<span>${((1 - (product.sale_price / product.price)).toFixed(2) * 100).toFixed(0)}%</span>` : ''
                    }
                                            </div>
                                        </div>
                                    </a>`
            }
            if (data.count <= 0) {
                btnMNore.textContent = 'Xem thêm 0'
                btnMNore.setAttribute('style', 'display: none')
            } else {
                btnMNore.textContent = 'Xem thêm ' + data.count
                btnMNore.setAttribute('style', 'display: block')
            }
        })
        .catch(error => console.error(error));
}