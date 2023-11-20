document.addEventListener("DOMContentLoaded", function () {
    var list = document.querySelectorAll('main .box')
    var list_img_banner = document.querySelectorAll('.slide-img img')
    var btn_slide_left = document.querySelector('.btn-slide-left')
    var btn_slide_right = document.querySelector('.btn-slide-right')
    var index_img_banner = 0
    list.forEach(item => {
        item.querySelector('#icon-next').onclick = () => {
            var thumbnail = item.querySelector('.box-scroll')
            var list_a = thumbnail.querySelectorAll('a')
            for(let i=0;i<4;i++){
                let a = list_a[i]
                if(a.offsetLeft - thumbnail.scrollLeft < 20 && a.offsetLeft - thumbnail.scrollLeft > 0&& i < 4){
                    let num_end = list_a[i + 1].offsetLeft - 5
                    let scrollInterval = setInterval(()=> {
                        if(num_end - item.querySelector('.box-scroll').scrollLeft > 20){
                            item.querySelector('.box-scroll').scrollLeft += 20
                        } else {
                            item.querySelector('.box-scroll').scrollLeft = num_end
                            clearInterval(scrollInterval)
                        }
                    }, 20)
                    break
                }
            }
        }
        item.querySelector('#icon-back').onclick = () => {
            var thumbnail = item.querySelector('.box-scroll')
            var list_a = thumbnail.querySelectorAll('a')
            for(let i=0;i<5;i++){
                let a = list_a[i]
                if(a.offsetLeft - thumbnail.scrollLeft < 20 && a.offsetLeft - thumbnail.scrollLeft > 0&& i > 0){
                    let num_end = list_a[i - 1].offsetLeft - 5
                    let scrollInterval = setInterval(()=> {
                        if(item.querySelector('.box-scroll').scrollLeft - num_end > 20){
                            item.querySelector('.box-scroll').scrollLeft -= 20
                        } else {
                            item.querySelector('.box-scroll').scrollLeft = num_end
                            clearInterval(scrollInterval)
                        }
                    }, 20)
                    break
                }
            }
        }
    })

    for(let i=0;i<list_img_banner.length;i++){
        if(i!= index_img_banner) {
            list_img_banner[i].setAttribute('style','display: none')
        } else {
            list_img_banner[i].setAttribute('style','display: block')
        }
    }

    btn_slide_right.onclick = () => {
        index_img_banner++
        if(index_img_banner > list_img_banner.length - 1) {
            index_img_banner = 0
        }
        for(let i=0;i<list_img_banner.length;i++){
            if(i!= index_img_banner) {
                list_img_banner[i].setAttribute('style','display: none')
            } else {
                list_img_banner[i].setAttribute('style','display: block')
            }
        }
    }

    btn_slide_left.onclick = () => {
        index_img_banner--
        if(index_img_banner < 0) {
            index_img_banner = list_img_banner.length - 1
        }
        for(let i=0;i<list_img_banner.length;i++){
            if(i!= index_img_banner) {
                list_img_banner[i].setAttribute('style','display: none')
            } else {
                list_img_banner[i].setAttribute('style','display: block')
            }
        }
    }
})