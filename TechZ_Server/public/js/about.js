//Laptop
async function laptop() {

    var noindex = this.documentElement.querySelectorAll('.product-body')
    var list = []
    console.log(noindex)

    for (let i = 0; i < noindex.length; i++) {
        let noindex_child = noindex[i]
        let images = noindex_child.querySelector('.product-main').querySelectorAll('img.gallery-demo')
        let name = noindex_child.querySelector('.product-name').textContent
        console.log(name)
        while (name[name.length - 1] == ' ') {
            name = name.substring(0, name.length - 2)
        }
        let price = noindex_child.querySelector('.product-price').querySelector('del').textContent
        while (price.indexOf('.') >= 0) {
            price = price.replace('.', '')
        }
        price = price.replace('₫', '')
        let sale_price = noindex_child.querySelector('.product-price').querySelector('.pro-price').textContent
        while (sale_price.indexOf('.') >= 0) {
            sale_price = sale_price.replace('.', '')
        }
        sale_price = sale_price.replace('₫', '')

        let base64 = []
        for (let j = 0; j < images.length; j++) {
            let element_image = images[j]
            let base = await getBase64FromImageUrl(element_image.src)
            base64.push(base)
        }

        var desc_short = []
        try {
            desc_short = noindex_child.querySelector('.product-technical--content  ul').querySelectorAll('li')
        }catch(e){

        }
        let desc = []

        for(let j=0;j<desc_short.length;j++){
            let contents = desc_short[j].querySelectorAll('div')
            desc.push({
                title: contents[0].textContent,
                content: contents[1].textContent
            })
        }

        let table = noindex_child.querySelector('.scroll-table').querySelector('tbody').querySelectorAll('tr')

        let info = []

        for (let j = 0; j < table.length; j++) {
            let tr = table[j]
            let td = tr.querySelectorAll('td')
            if (td.length > 0) {
                let title = td[0].textContent
                let details = []
                if (td[1]) {
                    if (td[1].childNodes[0].tagName == 'UL') {
                        let lis = td[1].querySelectorAll('li')
                        for (let k = 0; k < lis.length; k++) {
                            details.push(lis[k].textContent)
                        }
                    } else {
                        details.push(td[1].textContent)
                    }
                    info.push({ title, details })
                }
            }
        }
        let company = name.substring(name.indexOf(' ') + 1, name.indexOf(' ', name.indexOf(' ') + 1))
        price = JSON.parse(price)
        sale_price = JSON.parse(sale_price)
        list.push({
            name,
            price,
            company,
            sale_price, base64,
            info,
            desc
        })
    }

    console.log(list)
    //const response = await axios.post('/test/laptop', { list: list })
}

// Màn hình
async function monitor() {

    var noindex = this.documentElement.querySelectorAll('.product-body')
    var list = []
    console.log(noindex)

    for (let i = 0; i < noindex.length; i++) {
        let noindex_child = noindex[i]
        let images = noindex_child.querySelector('.product-main').querySelectorAll('img.gallery-demo')
        let name = noindex_child.querySelector('.product-name').textContent
        console.log(name)
        while (name[name.length - 1] == ' ') {
            name = name.substring(0, name.length - 2)
        }
        let price = noindex_child.querySelector('.product-price').querySelector('del').textContent
        while (price.indexOf('.') >= 0) {
            price = price.replace('.', '')
        }
        price = price.replace('₫', '')
        let sale_price = noindex_child.querySelector('.product-price').querySelector('.pro-price').textContent
        while (sale_price.indexOf('.') >= 0) {
            sale_price = sale_price.replace('.', '')
        }
        sale_price = sale_price.replace('₫', '')

        let base64 = []
        for (let j = 0; j < images.length; j++) {
            let element_image = images[j]
            let base = await getBase64FromImageUrl(element_image.src)
            base64.push(base)
        }

        let table = noindex_child.querySelector('.scroll-table').querySelector('tbody').querySelectorAll('tr')

        let info = []

        for (let j = 0; j < table.length; j++) {
            let tr = table[j]
            let td = tr.querySelectorAll('td')
            if (td.length > 0) {
                let title = td[0].textContent
                let details = []
                if (td[1]) {
                    let lis = []
                    try {
                        lis = td[1].querySelectorAll('li')
                        if(!lis.length > 0){
                            lis = td[1].querySelectorAll('p')
                        }
                    }catch(e){

                    }
                    if (lis.length > 0) {
                        for (let k = 0; k < lis.length; k++) {
                            details.push(lis[k].textContent)
                        }
                    } else {
                        details.push(td[1].textContent)
                    }
                    info.push({ title, details })
                }
            }
        }
        let desc = []
        try {
            var desc_short = noindex_child.querySelector('.product-technical--content  ul').querySelectorAll('li')

            for(let j=0;j<desc_short.length;j++){
                let contents = desc_short[j].querySelectorAll('div')
                desc.push({
                    title: contents[0].textContent,
                    content: contents[1].textContent
                })
            }
        }catch(e){

        }

        let company = name.substring(name.indexOf(' ') + 1, name.indexOf(' ', name.indexOf(' ') + 1))
        price = JSON.parse(price)
        sale_price = JSON.parse(sale_price)
        list.push({
            name,
            price,
            company,
            sale_price, base64,
            info,
            desc
        })
    }

    console.log(list)
    // const response = await axios.post('/test/monitor', { list: list })
}

async function keyboad(){
    var noindex = this.documentElement.querySelectorAll('.product-body')
    var list = []
    console.log(noindex)

    for (let i = 0; i < noindex.length; i++) {
        let noindex_child = noindex[i]
        let images = noindex_child.querySelector('.product-main').querySelectorAll('img.gallery-demo')
        let name = noindex_child.querySelector('.product-name').textContent
        console.log(name)
        while (name[name.length - 1] == ' ') {
            name = name.substring(0, name.length - 2)
        }
        let price = noindex_child.querySelector('.product-price').querySelector('del').textContent
        while (price.indexOf('.') >= 0) {
            price = price.replace('.', '')
        }
        price = price.replace('₫', '')
        let sale_price = noindex_child.querySelector('.product-price').querySelector('.pro-price').textContent
        while (sale_price.indexOf('.') >= 0) {
            sale_price = sale_price.replace('.', '')
        }
        sale_price = sale_price.replace('₫', '')

        let base64 = []
        for (let j = 0; j < images.length; j++) {
            let element_image = images[j]
            let base = await getBase64FromImageUrl(element_image.src)
            base64.push(base)
        }

        let table = noindex_child.querySelector('.scroll-table').querySelector('tbody').querySelectorAll('tr')

        let info = []

        for (let j = 0; j < table.length; j++) {
            let tr = table[j]
            let td = tr.querySelectorAll('td')
            if (td.length > 0) {
                let title = td[0].textContent
                let details = []
                if (td[1]) {
                    if (td[1].childNodes[0].tagName == 'UL') {
                        let lis = td[1].querySelectorAll('li')
                        for (let k = 0; k < lis.length; k++) {
                            details.push(lis[k].textContent)
                        }
                    } else {
                        details.push(td[1].textContent)
                    }
                    info.push({ title, details })
                }
            }
        }

        
        let desc = []
        try {
            var desc_short = noindex_child.querySelector('.product-technical--content  ul').querySelectorAll('li')
            for(let j=0;j<desc_short.length;j++){
                let contents = desc_short[j].querySelectorAll('div')
                desc.push({
                    title: contents[0].textContent,
                    content: contents[1].textContent
                })
            }
        } catch(e){

        }
        let company = name.substring(name.indexOf(' ') + 1, name.indexOf(' ', name.indexOf(' ') + 1))
        price = JSON.parse(price)
        sale_price = JSON.parse(sale_price)
        list.push({
            name,
            price,
            company,
            sale_price, base64,
            info,
            desc
        })
    }

    console.log(list)
    //const response = await axios.post('/test/keyboad', { list: list })
}

async function headphone(){
    var noindex = this.documentElement.querySelectorAll('.product-body')
    var list = []
    console.log(noindex)

    for (let i = 0; i < noindex.length; i++) {
        let noindex_child = noindex[i]
        let images = noindex_child.querySelector('.product-main').querySelectorAll('img.gallery-demo')
        let name = noindex_child.querySelector('.product-name').textContent
        console.log(name)
        while (name[name.length - 1] == ' ') {
            name = name.substring(0, name.length - 2)
        }
        let price = noindex_child.querySelector('.product-price').querySelector('del').textContent
        while (price.indexOf('.') >= 0) {
            price = price.replace('.', '')
        }
        price = price.replace('₫', '')
        let sale_price = noindex_child.querySelector('.product-price').querySelector('.pro-price').textContent
        while (sale_price.indexOf('.') >= 0) {
            sale_price = sale_price.replace('.', '')
        }
        sale_price = sale_price.replace('₫', '')

        let base64 = []
        for (let j = 0; j < images.length; j++) {
            let element_image = images[j]
            let base = await getBase64FromImageUrl(element_image.src)
            base64.push(base)
        }

        let table = noindex_child.querySelector('.scroll-table').querySelector('tbody').querySelectorAll('tr')

        let info = []

        for (let j = 0; j < table.length; j++) {
            let tr = table[j]
            let td = tr.querySelectorAll('td')
            if (td.length > 0) {
                let title = td[0].textContent
                let details = []
                if (td[1]) {
                    if (td[1].childNodes[0].tagName == 'UL') {
                        let lis = td[1].querySelectorAll('li')
                        for (let k = 0; k < lis.length; k++) {
                            details.push(lis[k].textContent)
                        }
                    } else {
                        details.push(td[1].textContent)
                    }
                    info.push({ title, details })
                }
            }
        }

        
        let desc = []
        try {
            var desc_short = noindex_child.querySelector('.product-technical--content  ul').querySelectorAll('li')
        for(let j=0;j<desc_short.length;j++){
            let contents = desc_short[j].querySelectorAll('div')
            desc.push({
                title: contents[0].textContent,
                content: contents[1].textContent
            })
        }
        }catch(e){

        }
        let company = name.substring(name.indexOf(' ') + 1, name.indexOf(' ', name.indexOf(' ') + 1))
        price = JSON.parse(price)
        sale_price = JSON.parse(sale_price)
        list.push({
            name,
            price,
            company,
            sale_price, base64,
            info,
            desc
        })
    }

    console.log(list)
    //const response = await axios.post('/test/headphone', { list: list })
}

async function mouse(){
    var noindex = this.documentElement.querySelectorAll('.product-body')
    var list = []
    console.log(noindex)

    for (let i = 0; i < noindex.length; i++) {
        let noindex_child = noindex[i]
        let images = noindex_child.querySelector('.product-main').querySelectorAll('img.gallery-demo')
        let name = noindex_child.querySelector('.product-name').textContent
        console.log(name)
        while (name[name.length - 1] == ' ') {
            name = name.substring(0, name.length - 2)
        }
        let price = noindex_child.querySelector('.product-price').querySelector('del').textContent
        while (price.indexOf('.') >= 0) {
            price = price.replace('.', '')
        }
        price = price.replace('₫', '')
        let sale_price = noindex_child.querySelector('.product-price').querySelector('.pro-price').textContent
        while (sale_price.indexOf('.') >= 0) {
            sale_price = sale_price.replace('.', '')
        }
        sale_price = sale_price.replace('₫', '')

        let base64 = []
        for (let j = 0; j < images.length; j++) {
            let element_image = images[j]
            let base = await getBase64FromImageUrl(element_image.src)
            base64.push(base)
        }

        let table = noindex_child.querySelector('.scroll-table').querySelector('tbody').querySelectorAll('tr')

        let info = []

        for (let j = 0; j < table.length; j++) {
            let tr = table[j]
            let td = tr.querySelectorAll('td')
            if (td.length > 0) {
                let title = td[0].textContent
                let details = []
                if (td[1]) {
                    if (td[1].childNodes[0].tagName == 'UL') {
                        let lis = td[1].querySelectorAll('li')
                        for (let k = 0; k < lis.length; k++) {
                            details.push(lis[k].textContent)
                        }
                    } else {
                        details.push(td[1].textContent)
                    }
                    info.push({ title, details })
                }
            }
        }

        
        let desc = []
        try {
            var desc_short = noindex_child.querySelector('.product-technical--content  ul').querySelectorAll('li')
            for(let j=0;j<desc_short.length;j++){
                let contents = desc_short[j].querySelectorAll('div')
                desc.push({
                    title: contents[0].textContent,
                    content: contents[1].textContent
                })
            }
        }catch(e){

        }
        let company = name.substring(name.indexOf(' ') + 1, name.indexOf(' ', name.indexOf(' ') + 1))
        price = JSON.parse(price)
        sale_price = JSON.parse(sale_price)
        list.push({
            name,
            price,
            company,
            sale_price, base64,
            info,
            desc
        })
    }

    console.log(list)
    //const response = await axios.post('/test/mouse', { list: list })
}

async function mousepad(){
    var noindex = this.documentElement.querySelectorAll('.product-body')
    var list = []
    console.log(noindex)

    for (let i = 0; i < noindex.length; i++) {
        let noindex_child = noindex[i]
        let images = noindex_child.querySelector('.product-main').querySelectorAll('img.gallery-demo')
        if(images.length == 0){
            images = noindex_child.querySelector('.product-main').querySelectorAll('.boxlazy-img--aspect img')
        }
        let name = noindex_child.querySelector('.product-name').textContent
        console.log(name)
        while (name[name.length - 1] == ' ') {
            name = name.substring(0, name.length - 2)
        }
        let price = noindex_child.querySelector('.product-price').querySelector('del').textContent
        while (price.indexOf('.') >= 0) {
            price = price.replace('.', '')
        }
        price = price.replace('₫', '')
        let sale_price = noindex_child.querySelector('.product-price').querySelector('.pro-price').textContent
        while (sale_price.indexOf('.') >= 0) {
            sale_price = sale_price.replace('.', '')
        }
        sale_price = sale_price.replace('₫', '')

        let base64 = []
        for (let j = 0; j < images.length; j++) {
            let element_image = images[j]
            let base = await getBase64FromImageUrl(element_image.src)
            base64.push(base)
        }

        let table = noindex_child.querySelector('.scroll-table').querySelector('tbody').querySelectorAll('tr')

        let info = []

        for (let j = 0; j < table.length; j++) {
            let tr = table[j]
            let td = tr.querySelectorAll('td')
            if (td.length > 0) {
                let title = td[0].textContent
                let details = []
                if (td[1]) {
                    if (td[1].childNodes[0].tagName == 'UL') {
                        let lis = td[1].querySelectorAll('li')
                        for (let k = 0; k < lis.length; k++) {
                            details.push(lis[k].textContent)
                        }
                    } else {
                        details.push(td[1].textContent)
                    }
                    info.push({ title, details })
                }
            }
        }

        let company = name.substring(name.indexOf(' ') + 1, name.indexOf(' ', name.indexOf(' ') + 1))
        price = JSON.parse(price)
        sale_price = JSON.parse(sale_price)
        list.push({
            name,
            price,
            company,
            sale_price, base64,
            info
        })
    }

    console.log(list)
    //const response = await axios.post('/test/mousepad', { list: list })
}


//document.addEventListener('DOMContentLoaded', mousepad)

async function getBase64FromImageUrl(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();

        return new Promise((resolve) => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        throw new Error('Không thể tải ảnh');
    }
}