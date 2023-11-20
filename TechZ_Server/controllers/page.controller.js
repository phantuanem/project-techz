const queryMysql = require('../mysql/query.mysql')
const bcrypt = require("bcrypt")
const saltRounds = 10

class PageControlller {
    async home(req, res) {
        try {
            var category = await queryMysql.queryMany(`SELECT id FROM category`)
            category = category.map(item => item.id)
            var list = []
            for (var id of category) {
                let list_temp = await queryMysql.queryMany(`select p.id, p.name, p.sale_price, p.price, substring_index(group_concat(distinct img.url order by img.id asc), ',', 1) as url, category.slug
                        from product as p
                        inner join image as img on p.id=img.productID
                        inner join category on category.id = p.categoryID
                        where categoryID=${id} and price>sale_price
                        group by p.id
                        order by rand()
                        limit 8`)
                list.push(list_temp)
            }

            res.render('home', {
                page: 'home',
                css: '/css/home.css',
                js: '/js/home.js',
                title: 'Trang chủ || techZ',
                list,
                user: req.user,
                quantity_order: req.quantity_order
            })
        } catch (e) {
            console.log(e)
        }
    }

    async pages(req, res) {
        try {
            let brands = await queryMysql.queryMany(`select * from brand where id in(select brandID from product 
                where categoryID in (select id from category where slug='${req.params.slug}'))`)

            var list = []
            for (var brand of brands) {
                let id = brand.id
                let list_temp = await queryMysql.queryMany(`select p.id, p.name, p.sale_price, p.price, p.brandID, substring_index(group_concat(distinct img.url order by img.id asc), ',', 1) as url
                    from product as p
                    inner join image as img on p.id=img.productID
                    where brandID=${id} and p.categoryID in (select id from category where slug='${req.params.slug}')
                    group by p.id
                    order by rand()
                    limit 6`)
                list.push(list_temp)
            }

            res.render('pages', {
                page: 'pages',
                css: '/css/pages.css',
                js: '/js/pages.js',
                title: 'Best Saller',
                brands,
                slug: req.params.slug,
                list,
                user: req.user,
                quantity_order: req.quantity_order
            })
        } catch (e) {
            console.log(e)
        }
    }

    async page(req, res) {
        try {
            var list = await queryMysql.queryMany(`SELECT p.id, p.name, p.price, p.sale_price, SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.url ORDER BY img.id ASC), ',', 1) AS url
            FROM product AS p
            INNER JOIN image AS img ON p.id = img.productID
            WHERE p.categoryID in (SELECT id FROM category WHERE slug='${req.params.slug}')
            AND p.brandID=${req.params.id}
            GROUP BY p.id
            LIMIT 10`)

            var count_product = await queryMysql.queryMany(`select count(id) as count from product as p
            WHERE p.categoryID in (SELECT id FROM category WHERE slug='${req.params.slug}')
            AND p.brandID=${req.params.id}`)

            res.render('page', {
                page: 'pages',
                css: '/css/page.css',
                js: '/js/page.js',
                title: 'Tất cả Laptop',
                list,
                slug: req.params.slug,
                brandID: req.params.id,
                count: count_product[0].count - 10,
                user: req.user,
                quantity_order: req.quantity_order
            })
        } catch (e) {
            console.log(e)
        }
    }

    async product(req, res) {
        try {
            const list = await queryMysql.queryMany(`select product.id, product.categoryID, product.name, product.brandID,brand.name as name_brand, product.brandID, product.price, product.sale_price, product.quarranty_period, 
            category.name as category_name, category.slug as category_slug,
            group_concat(distinct img.url order by img.id asc) as urls,
            group_concat(distinct concat(title.title,'$',content.content) order by content.id asc separator ';') as info,
            group_concat(distinct concat(ds.title,'$',ds.content) order by ds.id asc separator ';') as desc_short
            from product as product
            inner join category on category.id = product.categoryID
            inner join image as img on product.id=img.productID
            inner join desc_title as title on title.productID=product.id
            inner join desc_content as content on content.titleID=title.id
            inner join brand on brand.id = product.brandID
            left join desc_short as ds on ds.productID=product.id 
            where product.id = ${req.params.id}
            group by product.id`)

            var product = list[0]
            product.urls = product.urls.split(',')
            product.info = product.info.split(';')
            if (product.desc_short) {
                product.desc_short = product.desc_short.split(';')
                let desc = []
                for (let i = 0; i < product.desc_short.length; i++) {
                    let arr_temp = product.desc_short[i].split('$')
                    desc.push({
                        title: arr_temp[0],
                        content: arr_temp[1]
                    })
                }
                product.desc_short = desc
            }
            var info = []
            product.info.forEach(item => {
                let temp = item.split('$')
                info.push({
                    title: temp[0],
                    context: [temp[1]]
                })
            })
            for (let i = 0; i < info.length - 1; i++) {
                if (info[i].title == info[i + 1].title) {
                    info[i].context.push(info[i + 1].context[0])
                    info.splice(i + 1, 1)
                    i--
                }
            }
            product.info = info

            const list_suggest = await queryMysql.queryMany(`select p.id, p.name, p.sale_price, p.price, substring_index(group_concat(distinct img.url order by img.id asc), ',', 1) as url
            from product as p
            inner join image as img on p.id=img.productID
            where categoryID=${product.categoryID} and p.brandID=${product.brandID}
            group by p.id
            order by rand()
            limit 6`)
            if (list.length > 0) {
                res.render('product', {
                    page: 'product',
                    css: '/css/product.css',
                    js: '/js/product.js',
                    title: product.name,
                    product,
                    list_suggest,
                    user: req.user,
                    quantity_order: req.quantity_order
                })
            } else {
                res.redirect('/')
            }
        } catch (e) {
            console.log(e)
        }
    }

    async profile(req, res) {
        try {
            if (!req.user) {
                return res.redirect('/')
            }
            var orders = []
            var order = null
            var contact = null
            if (req.query?.form == 'order') {
                orders = await queryMysql.queryMany(`select * from ${'`order`'} inner join order_status as os on os.orderID=order.id where customerID=${req.user.id}`)
                orders.forEach(order => {
                    let date = new Date(order.order_date)
                    order.order_date = {
                        minute: date.getMinutes() < 10 ? '0' + date.getMinutes():date.getMinutes(),
                        hour: date.getHours() < 10 ? '0' + date.getHours():date.getHours(),
                        date: date.getDate() < 10 ? '0' + date.getDate():date.getDate(),
                        month: (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1):(date.getMonth() + 1),
                        year: date.getFullYear() < 10 ? '0' + date.getFullYear():date.getFullYear(),
                    }
                })
            } else if (req.query?.form == 'address') {
                contact = await queryMysql.queryOne(`select address, phone_number from customer where id=${req.user.id}`)
            } else if(req.query.form == 'order-detail' && req.query.id){
                order = await queryMysql.queryOne(`select * from ${'`order`'} 
                                                    inner join order_status as os on os.orderID=order.id
                                                    inner join bill on bill.orderID=order.id
                                                    where order.customerID=${req.user.id} and order.id=${req.query.id}`)
                order.list = await queryMysql.queryMany(`select product.id as productID, product.name, product.quarranty_period, item.price, item.quantity from item 
                                                        inner join product on product.id=item.productID
                                                        where item.orderID=${req.query.id}`)
                order.voucher = await queryMysql.queryOne(`select * from voucher where orderID=${order.orderID}`)
                let date = new Date(order.order_date)
                order.order_date = {
                    minute: date.getMinutes() < 10 ? '0' + date.getMinutes():date.getMinutes(),
                    hour: date.getHours() < 10 ? '0' + date.getHours():date.getHours(),
                    date: date.getDate() < 10 ? '0' + date.getDate():date.getDate(),
                    month: (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1):(date.getMonth() + 1),
                    year: date.getFullYear() < 10 ? '0' + date.getFullYear():date.getFullYear(),
                }
            }
            var user = await queryMysql.queryOne(`select account.id, customer.name as name, email, password from account
                                                    inner join customer on customer.accountID=account.id
                                                    where customer.id=${req.user.id}`)
            if(user.password != null){
                user.password = true
            } else {
                user.password = false
            }
            res.render('profile', {
                page: 'profile',
                css: '/css/profile.css',
                js: '/js/profile.js',
                title: 'Quản lý tài khoản',
                user,
                phone_number: contact?.phone_number,
                address: contact?.address,
                quantity_order: req.quantity_order,
                form: req.query.form ? req.query.form : 'profile',
                orders: orders.reverse(),
                order
            })
        } catch (e) {
            console.log(e)
        }
    }

    logout(req, res) {
        res.clearCookie("session")
        res.clearCookie("session.sig")
        res.redirect('/')
    }

    async cart(req, res) {
        try {
            if (!req.user) {
                return res.redirect('/')
            }
            const list = await queryMysql.queryMany(`select p.id, p.price, p.sale_price, p.name, ord.quantity as quantity, ord.id as orderID, ord.id as id_cart_item,
                substring_index(group_concat(distinct img.url order by img.id asc),',',1) as url from product as p
                inner join item as ord on p.id=ord.productID
                inner join cart as car on car.id=ord.cartID
                inner join customer as ct on ct.id=car.customerID
                inner join image as img on img.productID=p.id
                where ct.id=${req.user.id} and ord.orderID IS NULL
                group by ord.id`)

            let sum_price = 0

            for (let item of list) {
                sum_price += item.sale_price * item.quantity
            }

            res.render('cart', {
                page: 'cart',
                css: '/css/cart.css',
                js: '/js/cart.js',
                title: 'Giỏ hàng',
                user: req.user,
                list,
                sum_price,
                quantity_order: req.quantity_order
            })
        } catch (e) {
            console.log(e)
        }
    }

    async create_payment(req, res) {
        try {
            let result_voucher = null
            if(req.query.voucher){
                result_voucher = await  queryMysql.queryOne(`select amount from voucher where voucher_code='${req.query.voucher}'`)
            }
            req.query.online_payment = JSON.parse(req.query.online_payment)
            if (req.query?.online_payment == false) {
                res.redirect('/cart/delivery-information?voucher=' + req.query.voucher)
            }
            const list = await queryMysql.queryMany(`select p.id, p.price, p.sale_price, p.name, ord.quantity as quantity, ord.id as orderID,
            substring_index(group_concat(distinct img.url order by img.id asc),',',1) as url from product as p
            inner join item as ord on p.id=ord.productID
            inner join cart as car on car.id=ord.cartID
            inner join customer as us on us.id=car.customerID
            inner join image as img on img.productID=p.id
            where us.id=${req.user.id} and ord.orderID IS NULL
            group by ord.id`)

            let contact = await queryMysql.queryOne(`select address, phone_number from customer where id=${req.user.id}`)

            let sum_price = 0

            for (let item of list) {
                sum_price += item.sale_price * item.quantity
            }

            res.render('create_payment', {
                page: 'create_payment',
                css: '/css/create_payment.css',
                js: '/js/create_payment.js',
                title: 'Thanh toán trực tuyến',
                user: req.user,
                sum_price,
                contact,
                result_voucher,
                voucher_code: req.query.voucher ? req.query.voucher:null,
                quantity_order: req.quantity_order
            })
        } catch (e) {
            console.log(e)
        }
    }

    async delivery_information(req, res) {
        try {
            let result_voucher = null
            if(req.query.voucher){
                result_voucher = await  queryMysql.queryOne(`select amount from voucher where voucher_code='${req.query.voucher}' and is_used=false and orderID is null`)
            }
            const list = await queryMysql.queryMany(`select p.id, p.price, p.sale_price, p.name, ord.quantity as quantity, ord.id as orderID,
            substring_index(group_concat(distinct img.url order by img.id asc),',',1) as url from product as p
            inner join item as ord on p.id=ord.productID
            inner join cart as car on car.id=ord.cartID
            inner join customer as us on us.id=car.customerID
            inner join image as img on img.productID=p.id
            where us.id=${req.user.id} and ord.orderID IS NULL
            group by ord.id`)

            let contact = await queryMysql.queryOne(`select address, phone_number from customer where id=${req.user.id}`)

            let sum_price = 0

            for (let item of list) {
                sum_price += item.sale_price * item.quantity
            }

            res.render('delivery_information', {
                page: 'delivery_information',
                css: '/css/create_payment.css',
                js: '/js/create_payment.js',
                title: 'Thanh toán khi nhận hàng',
                user: req.user,
                sum_price,
                contact,
                result_voucher,
                voucher_code: req.query.voucher ? req.query.voucher:null,
                quantity_order: req.quantity_order
            })
        } catch (e) {
            console.log(e)
        }
    }

    async search(req, res) {
        try {
            var list = await queryMysql.queryMany(`SELECT p.id, p.name, p.price, p.sale_price, SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.url ORDER BY img.id ASC), ',', 1) AS url
            FROM product AS p
            INNER JOIN image AS img ON p.id = img.productID
            WHERE lower(p.name) LIKE '%${req.query.search.toLowerCase()}%'
            GROUP BY p.id
            LIMIT 10`)

            var count_product = await queryMysql.queryMany(`select count(id) as count from product as p
            WHERE lower(p.name) LIKE '%${req.query.search.toLowerCase()}%'`)

            res.render('search', {
                page: 'search',
                css: '/css/search.css',
                js: '/js/search.js',
                title: 'Tìm kiếm "' + req.query.search + '"',
                list,
                slug: req.params.slug,
                brandID: req.params.id,
                count: count_product[0].count - 10,
                user: req.user,
                quantity_order: req.quantity_order
            })
        } catch (e) {
            console.log(e)
        }
    }

    async updateAddress(req, res) {
        try {
            if (req.query?.city && req.query?.district && req.query?.ward && req.query?.address_detail) {
                let result_update_address = await queryMysql.update(`update customer set address='(${req.query.address_detail}) - ${req.query.ward} - ${req.query.district} - ${req.query.city}' where id=${req.user.id}`)
                res.redirect('/profile?form=address')
            }
        } catch (e) {
            console.log(e)
        }
    }

    async updatePhone(req, res) {
        try {
            if (req.query?.phone) {
                let result_update_address = await queryMysql.update(`update customer set phone_number='${req.query.phone}' where id=${req.user.id}`)
                res.redirect('/profile?form=address')
            }
        } catch (e) {
            console.log(e)
        }
    }

    async createOrder(req, res) {
        try {
            let result_voucher = null
            if(req.query.voucher_code){
                result_voucher = await  queryMysql.queryOne(`select amount from voucher where voucher_code='${req.query.voucher_code}' and is_used=false and orderID is null`)
            }
            var date = new Date()
            date = date.toJSON()

            const list = await queryMysql.queryMany(`select p.id, p.price, p.sale_price, p.name, ord.quantity as quantity, ord.id as orderID,
                substring_index(group_concat(distinct img.url order by img.id asc),',',1) as url from product as p
                inner join item as ord on p.id=ord.productID
                inner join cart as car on car.id=ord.cartID
                inner join customer as us on us.id=car.customerID
                inner join image as img on img.productID=p.id
                where us.id=${req.user.id} and ord.orderID IS NULL
                group by ord.id`)

            let sum_price = 0

            for (let item of list) {
                sum_price += item.sale_price * item.quantity
            }
            if(result_voucher?.amount){
                sum_price = sum_price - result_voucher.amount
            }

            let contact = await queryMysql.queryOne(`select address, phone_number from customer where id=${req.user.id}`)
            let result_create_order = await queryMysql.insert(`insert into ${'`order`'}(customerID, order_date, delivery_address, phone_number, total_amount)
                                                                value(${req.user.id},'${date}','${contact.address}','${contact.phone_number}',${sum_price})`)
            let result_update_item = await queryMysql.update(`UPDATE item, product, cart
                                                            SET orderID=${result_create_order.insertId}, item.price = CASE
                                                                WHEN product.sale_price = 0 OR product.sale_price = product.price THEN product.price
                                                                ELSE product.sale_price
                                                            END
                                                            WHERE item.productID = product.id and item.orderID IS NULL and item.cartID=cart.id and cart.customerID=${req.user.id}`)
            let reult_create_bill = await queryMysql.insert(`insert into bill(orderID, total, bill_date, payment_status, payment_method)value
                                                        (${result_create_order.insertId},${sum_price}, '${date}',false,'COD')`)
            let result_create_order_status = await queryMysql.insert(`insert into order_status(orderID, new)value(${result_create_order.insertId},true)`)
            if(result_voucher?.amount){
                let result_update_voucher = await queryMysql.update(`update voucher set is_used=true, orderID=${result_create_order.insertId} where voucher_code='${req.query.voucher_code}'`)
            }
            res.redirect('/profile?form=order')
        } catch (e) {
            console.log(e)
        }
    }

    async updateInfoUser(req, res) {
        try {
            if(req.query?.new_password && req.query?.new_password.length){
                var account = await queryMysql.queryOne(`select account.id, password from account inner join customer on customer.accountID=account.id where customer.id=${req.user.id}`)
                var hash = await bcrypt.hash(req.query.new_password, saltRounds)
                if(account.password == null && req.query?.new_password && req.query?.new_password.length){
                    var result_update_password = await queryMysql.update(`update account set password='${hash}' where id=${account.id}`)
                } else if(req.query?.password && req.query?.password.length && req.query?.new_password && req.query?.new_password.length) {
                    let checkPass = await bcrypt.compare(req.query.password, account.password)
                    if(checkPass){
                        var result_update_password = await queryMysql.update(`update account set password='${hash}' where id=${account.id}`)
                    }
                }
            }
            let result_update = await queryMysql.update(`update customer set name='${req.query.name}' where id=${req.user.id}`)
            res.redirect('/profile')
        } catch (e) {
            console.log(e)
        }
    }

    async cancelOrder(req, res){
        try {
            var order = await queryMysql.queryOne(`select * from order_status where new=true and processing=false and shipping=false and delivered=false and orderID=${req.query.id}`)
            if(order){
                var result_cancel = await queryMysql.update(`update order_status set new=false, processing=false, shipping=false, delivered=false where orderID=${req.query.id}`)
            }
            res.redirect('/profile?form=order-detail&id=' + req.query.id)
        }catch(e){
            console.log(e)
        }
    }

    async confirmDelivered(req, res){
        try {
            var order = await queryMysql.queryOne(`select * from order_status where new=true and processing=true and shipping=true and delivered=false and orderID=${req.query.id}`)
            if(order){
                var result_cancel = await queryMysql.update(`update order_status set new=true, processing=true, shipping=true, delivered=true where orderID=${req.query.id}`)
            }
            res.redirect('/profile?form=order-detail&id=' + req.query.id)
        }catch(e){
            console.log(e)
        }
    }
}

module.exports = new PageControlller