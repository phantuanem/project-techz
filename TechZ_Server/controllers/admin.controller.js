const queryMysql = require('../mysql/query.mysql')
const upload = require('../store/upload')
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var slug = require('slug')
const bcrypt = require("bcrypt")
const jwtPass = '1234567890'
const saltRounds = 10

function generateRandomStringVoucherCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 5;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

class Admin {
    async dashboard(req, res) {
        try {
            let date = new Date()
            let month = date.getMonth() + 1
            let year = date.getFullYear()
            if (month < 10) month = '0' + month
            let count_customer = await queryMysql.queryOne('select count(customer.id) as count from customer')
            let count_product = await queryMysql.queryOne('select count(id) as count from product')
            let count_brand = await queryMysql.queryOne('select count(id) as count from brand')
            let count_invoice = await queryMysql.queryOne(`select count(id) as count from ${'`order`'}`)
            let months = await queryMysql.queryMany(`SELECT EXTRACT(MONTH FROM order_date) AS month, SUM(total_amount) AS sum_total_amount
                                                    FROM ${'`order`'}
                                                    WHERE EXTRACT(YEAR FROM order_date) = 2023
                                                    GROUP BY EXTRACT(MONTH FROM order_date);`)
            let total_cagegory = await queryMysql.queryMany(`select category.name, sum(item.price) as total from item
                                                            inner join product on product.id=item.productID
                                                            inner join category on category.id=product.categoryID
                                                            group by category.id;`)

            months = months.sort((a, b) => {
                return a.month - b.month;
            });
            res.json({
                count_customer,
                count_product,
                count_brand,
                count_invoice,
                months,
                total_cagegory
            })
        } catch (e) {
            console.log(e)
        }
    }

    async getCtegoryAndBrand(req, res) {
        try {
            let resultCate = await queryMysql.queryMany('select * from category')
            let resultBrand = await queryMysql.queryMany('select * from brand')
            if (resultCate && resultBrand) {
                res.json({
                    category: resultCate,
                    brands: resultBrand
                })
            }
        } catch (e) {
            console.log(e)
        }
    }
    home(req, res) {
        res.json('hihi')
    }

    uploadGetInfo(req, res) {

    }

    async manageGetProducts(req, res) {
        try {
            let products = await queryMysql.queryMany(`select product.id, product.name,product.brandID, product.price, product.sale_price, product.quantity from product inner join category on category.id=product.categoryID where category.slug='${req.query.slug}'`)
            let brands = await queryMysql.queryMany(`select brand.id, brand.name from brand
                                                    inner join product on product.brandID=brand.id
                                                    inner join category on category.id=product.categoryID
                                                    where category.slug='${req.query.slug}'
                                                    group by brand.id;`)
            for (let i = 0; i < products.length; i++) {
                products[0].show = true
            }
            res.json({
                products,
                brands
            })
        } catch (e) {
            console.log(e)
        }
    }

    async addEmployee(req, res) {
        try {
            // let hash = await bcrypt.hash(req.body.password, saltRounds)
            // let date = new Date()
            // let result_create_account = await queryMysql.insert(`insert into account(email,password,created_date,role) value('${req.body.email}','${hash}','${date.toJSON()}',2)`)
            // if (result_create_account?.insertId > 0) {
            //     let result_create_employee = await queryMysql.insert(`insert into admin(accountID, first_name, last_name)value(${result_create_account.insertId},'${req.body.first_name}','${req.body.last_name}')`)
            //     if (result_create_employee.insertId > 0) {
            //         res.json(true)
            //     } else {
            //         res.json(false)
            //     }
            // }
            let countEmail = await queryMysql.queryOne(`select count(email) as count from account where email='${req.body.email}'`)
            if (countEmail.count == 0) {
                let hash = await bcrypt.hash(req.body.password, saltRounds)
                let date = new Date()
                let result_create_account = await queryMysql.insert(`insert into account(email,password,created_date,role) value('${req.body.email}','${hash}','${date.toJSON()}',1)`)
                if (result_create_account?.insertId > 0) {
                    let result_create_employee = await queryMysql.insert(`insert into employee(accountID, first_name, last_name, position)value(${result_create_account.insertId},'${req.body.first_name}','${req.body.last_name}', '${req.body.position}')`)
                    if (result_create_employee.insertId > 0) {
                        res.json(true)
                    } else {
                        res.json(false)
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async getEmployees(req, res) {
        try {
            let result_employees = await queryMysql.queryMany(`select ac.id as accountID, ac.email, el.first_name, el.last_name, el.position from account as ac
                                                                inner join employee as el on ac.id=el.accountID`)
            res.json(result_employees)
        } catch (e) {
            console.log(e)
        }
    }

    async getEmployee(req, res) {
        try {
            let result_employees = await queryMysql.queryOne(`select ac.id as accountID, ac.email, el.first_name, el.last_name, el.position from account as ac
                                                                inner join employee as el on ac.id=el.accountID
                                                                where ac.id=${req.query.accountID}`)
            res.json(result_employees)
        } catch (e) {
            console.log(e)
        }
    }

    async updateInfoEmployee(req, res) {
        try {
            let result_update_account = await queryMysql.update(`update account set email='${req.body.employee.email}' where id=${req.body.employee.accountID}`)
            if (result_update_account.affectedRows == 0) {
                console.log('Can not update table Account')
            }
            let first_name = req.body.employee.first_name.trim()
            let last_name = req.body.employee.last_name.trim()
            let result_update_employee = await queryMysql.update(`update employee set first_name='${first_name}', last_name='${last_name}', position='${req.body.employee.position}' where accountID=${req.body.employee.accountID}`)
            if (result_update_employee.affectedRows == 0) {
                console.log('Can not update table Employee')
            }
            res.json(true)
        } catch (e) {
            console.log(e)
        }
    }

    async getManageDetailProduct(req, res) {
        try {
            const list = await queryMysql.queryMany(`select product.id, product.categoryID, product.name, product.brandID,brand.name as brand_name, product.brandID, product.price, product.sale_price, product.quarranty_period, product.quantity,
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
            where product.id = ${req.query.productID}
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
            res.json(product)
        } catch (e) {
            console.log(e)
        }
    }

    async deleteEmployee(req, res) {
        try {
            let result_delete = await queryMysql.delete(`delete from account where id=${req.query.accountID}`)
            if (result_delete.affectedRows > 0) {
                res.json(true)
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async getOrders(req, res) {
        try {
            let orders = await queryMysql.queryMany(`select * from ${'`order`'}
                                                        inner join bill on bill.orderID=order.id
                                                        inner join order_status as ot on ot.orderID=order.id
                                                        inner join customer as ct on ct.id=order.customerID`)
            orders = orders.reverse()
            orders.forEach(async order => {
                let date = new Date(order.order_date)
                let obj_time = {
                    minute: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
                    hour: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
                    day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
                    month: (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                    year: date.getFullYear() < 10 ? '0' + date.getFullYear() : date.getFullYear(),
                }
                order.order_date = obj_time
                order.show = true
            })
            res.json(orders)
        } catch (e) {
            console.log(e)
        }
    }

    async updateOrderStatus(req, res) {
        try {
            let customer = await queryMysql.queryOne(`select email from account, customer, ${'`order`'} where account.id=customer.accountID and customer.id=order.customerID and order.id=${req.body.orderID}`)
            if (req.body.status == 'cancel') {
                let result_update = await queryMysql.update(`update order_status set new=false, processing=false, shipping=false, delivered=false where orderID=${req.body.orderID}`)
                console.log('Đã gửi mail hủy đơn tới email: ' + customer.email)
                if (result_update.affectedRows > 0) {
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: '',
                            pass: ''
                        }
                    });
                    var mainOptions = {
                        from: 'Tuan Em',
                        to: customer.email,
                        subject: 'TechZ THÔNG BÁO HỦY ĐƠN HÀNG',
                        text: 'You recieved message from ' + 'tuanem2503@gmail.com',
                        html: `<style>
                                    * {
                                        margin: 0;
                                        padding: 0;
                                        font-family: Arial, Helvetica, sans-serif;
                                    }
                                    p {
                                        font-size: 14px;
                                        padding: 2px 0;
                                    }
                                </style>
                                <p>Đơn hàng <strong>${req.body.orderID}</strong> của anh/chị đã bị hủy</p>
                                <p>Lý do: ${req.body.text_reason}</p>
                                <p>Mọi thắc mắc anh/chị vui lòng liên hệ email: <strong>techz@gmail.com</strong> hoặc gọi trực tiếp vào số: <strong>02948274634</strong></p>
                                <p>techZ cảm ơn quý khách hàng đã ghé thăm website</p>`
                    }
                    transporter.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                            res.redirect('/');
                        } else {
                            console.log('Message sent: ' + info.response);
                            res.redirect('/');
                        }
                    });
                    res.json(true)
                } else {
                    res.json(false)
                }
            }
            if (req.body.status == 'new') {
                let result_update = await queryMysql.update(`update order_status set new=true, processing=false, shipping=false, delivered=false where orderID=${req.body.orderID}`)
                if (result_update.affectedRows > 0) {
                    res.json(true)
                } else {
                    res.json(false)
                }
            }
            if (req.body.status == 'processing') {
                let result_update = await queryMysql.update(`update order_status set new=true, processing=true, shipping=false, delivered=false where orderID=${req.body.orderID}`)
                if (result_update.affectedRows > 0) {
                    res.json(true)
                } else {
                    res.json(false)
                }
            }
            if (req.body.status == 'shipping') {
                let result_update = await queryMysql.update(`update order_status set new=true, processing=true, shipping=true, delivered=false where orderID=${req.body.orderID}`)
                if (result_update.affectedRows > 0) {
                    res.json(true)
                } else {
                    res.json(false)
                }
            }
            if (req.body.status == 'delivered') {
                let result_update = await queryMysql.update(`update order_status set new=true, processing=true, shipping=true, delivered=true where orderID=${req.body.orderID}`)
                let result_update_order = await queryMysql.update(`update ${'`order`'} set has_voucher=true where id=${req.body.orderID}`)

                let order = await queryMysql.queryOne(`select customerID, total_amount from ${'`order`'} where id=${req.body.orderID}`)
                if (order.total_amount >= 1000000) {
                    let date = new Date()
                    let voucher_code = generateRandomStringVoucherCode()
                    let amount = 0
                    if (order.total_amount >= 1000000) {
                        amount = 40000
                    }
                    if (order.total_amount >= 10000000) {
                        amount = 100000
                    }
                    if (order.total_amount >= 20000000) {
                        amount = 150000
                    }
                    if (order.total_amount >= 30000000) {
                        amount = 200000
                    }
                    if (order.total_amount >= 40000000) {
                        amount = 300000
                    }
                    if (order.total_amount >= 50000000) {
                        amount = 500000
                    }
                    let result_create_voucher = await queryMysql.insert(`insert into voucher(customerID, voucher_code, is_used, create_date, amount) value(${order.customerID}, '${voucher_code}', false, '${date.toJSON()}', ${amount})`)
                    var transporter = nodemailer.createTransport({ // config mail server
                        service: 'Gmail',
                        auth: {
                            user: 'tuanem2503@gmail.com',
                            pass: 'mnxfxgdflwhbpksu'
                        }
                    });
                    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                        from: 'Tuan Em',
                        to: customer.email,
                        subject: 'TechZ GỬI MÃ GIẢM GIÁ',
                        text: 'You recieved message from ' + 'tuanem2503@gmail.com',
                        html: `<div class="box" style="font-family: Arial, Helvetica, sans-serif; padding: 1em; background-color: green; color: white;">
                                    <h1 style="margin: 0; padding: 0; text-align: center;">TechZ cảm ơn đã mua hàng</h1>
                                    <p style="margin: 0; padding: 0; font-size: 20px;">Gửi bạn mã giảm giá cho lần mua tiếp theo</p>
                                    <h2 style="margin: 0; padding: 0;">Mã giảm giá: ${voucher_code}</h2>
                            </div>`
                    }
                    transporter.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                            res.redirect('/');
                        } else {
                            console.log('Message sent: ' + info.response);
                            res.redirect('/');
                        }
                    });
                }
                if (result_update.affectedRows > 0) {
                    res.json(true)
                } else {
                    res.json(false)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async getOrder(req, res) {
        try {
            let order = await queryMysql.queryOne(`select order.id, order.phone_number, order.delivery_address, order.order_date, order.total_amount, customer.name as customer_name, voucher.amount as voucher_amount from ${'`order`'} 
                                            inner join customer on customer.id=order.customerID
                                            left join voucher on voucher.orderID=order.id
                                            where order.id=${req.query.orderID}`)
            let result_item = await queryMysql.queryMany(`select product.name, item.price, item.quantity, product.quarranty_period from item
                                                            inner join product on product.id=item.productID
                                                            where orderID=${req.query.orderID}`)
            let date = new Date(order.order_date)
            let obj_time = {
                minute: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
                hour: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
                day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
                month: (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                year: date.getFullYear() < 10 ? '0' + date.getFullYear() : date.getFullYear(),
            }
            order.order_date = obj_time
            res.json({
                order: order,
                list: result_item
            })
        } catch (e) {
            console.log(e)
        }
    }

    async getAllCustomer(req, res) {
        try {
            let list = await queryMysql.queryMany(`select email, name, address, phone_number from customer
                                                    inner join account on account.id=customer.accountID`)
            res.json(list)
        } catch (e) {
            console.log(e)
        }
    }

    async habdleLogin(req, res) {
        try {
            let result = await queryMysql.queryOne(`select * from account where email='${req.body.email}'`)
            if (result) {
                let checkPass = await bcrypt.compare(req.body.password, result.password)
                if (checkPass) {
                    let token = jwt.sign({ accountID: result.id, role: result.role }, jwtPass)
                    res.json(token)
                } else {
                    res.json(false)
                }
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async authLogin(req, res) {
        try {
            const verifyToken = jwt.verify(req.query.token, jwtPass)
            var user = null
            if (verifyToken.role == 2) {
                user = await queryMysql.queryOne(`select * from account inner join admin on admin.accountID=account.id where account.id=${verifyToken.accountID} and account.role=${verifyToken.role}`)
            } else if (verifyToken.role == 1) {
                user = await queryMysql.queryOne(`select * from account inner join employee on employee.accountID=account.id where account.id=${verifyToken.accountID} and account.role=${verifyToken.role}`)
            }
            user.password = undefined
            res.json(user)
        } catch (e) {
            console.log(e)
        }
    }

    async uploadProduct(req, res) {
        try {
            if (req.body.images.length > 0 && req.body.product.categoryID > 0 && req.body.product.brandID > 0 && req.body.product.name.length > 0 && req.body.product.price > 0 && req.body.product.sale_price > 0 && req.body.product.quantity > 0 && req.body.product.quarranty_period > 0) {
                let result_create_product = await queryMysql.insert(`insert into product(categoryID, brandID, name, price, sale_price, quantity, quarranty_period) value(${req.body.product.categoryID}, ${req.body.product.brandID}, '${req.body.product.name}', ${req.body.product.price}, ${req.body.product.sale_price}, ${req.body.product.quantity}, ${req.body.product.quarranty_period})`)
                let productID = result_create_product.insertId
                req.body.desc.forEach(async desc => {
                    if (desc.content.length > 0) {
                        let result_create_title = await queryMysql.insert(`insert into desc_title(productID, title) value(${productID}, '${desc.title}')`)
                        let result_create_content = await queryMysql.insert(`insert into desc_content(titleID, content) value(${result_create_title.insertId}, '${desc.content}')`)
                    }
                })
                req.body.desc_short.forEach(async desc => {
                    if (desc.content.length > 0) {
                        let result_create_desc_short = await queryMysql.insert(`insert into desc_short(productID, title, content) value(${productID}, '${desc.title}', '${desc.content}')`)
                    }
                })
                req.body.images.forEach(async base64 => {
                    let product = await queryMysql.queryOne(`select name from product where id=${productID}`)
                    let data = base64
                    const resildD = await upload.uploadFile(data, '1xjqEpPDrUKdkQcqONocctll1ta840Tky', product.name + '.jpg', '')
                    const result2 = await queryMysql.insert(`insert into image(productID, imageID, url) values(${productID}, '${resildD.fileId}', '${resildD.linkView}')`)
                })
                res.json(true)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async getProduct(req, res) {
        try {
            const category = await queryMysql.queryMany(`select * from category`)
            const product = await queryMysql.queryOne(`select * from product where id=${req.query.productID}`)
            const images = await queryMysql.queryMany(`select * from image where productID=${req.query.productID}`)
            const desc_short = await queryMysql.queryMany(`select * from desc_short where productID=${req.query.productID}`)
            var desc = await queryMysql.queryMany(`select * from desc_title where productID=${req.query.productID}`)
            for (let i = 0; i < desc.length; i++) {
                let contents = await queryMysql.queryMany(`select * from desc_content where titleID=${desc[i].id}`)
                desc[i].content = contents[0]
            }
            res.json({
                product,
                images,
                desc_short,
                category,
                desc
            })
        } catch (e) {
            console.log(e)
        }
    }

    async updateProduct(req, res) {
        try {
            if (req.body.product.categoryID > 0 && req.body.product.brandID > 0) {
                let result_update_product = await queryMysql.update(`update product set categoryID=${req.body.product.categoryID}, brandID=${req.body.product.brandID}, name='${req.body.product.name}', price=${req.body.product.price}, sale_price=${req.body.product.sale_price}, quantity=${req.body.product.quantity}, quarranty_period=${req.body.product.quarranty_period} where id=${req.body.product.id}`)
                req.body.desc_short.forEach(async ds => {
                    // if (ds.content.length == 0) {
                    //     let result_delete = await queryMysql.delete(`delete from desc_short where id=${ds.id}`)
                    // } else 
                    if (ds.content.length > 0) {
                        let result_update = await queryMysql.update(`update desc_short set content='${ds.content}' where id=${ds.id}`)
                    }
                })
                req.body.desc.forEach(async ds => {
                    let result_update = await queryMysql.update(`update desc_content set content='${ds.content.content}' where id=${ds.content.id}`)
                })
            }
            res.json(true)
        } catch (e) {
            console.log(e)
        }
    }

    async deleteImage(req, res) {
        try {
            var result_delete = await upload.deleteFile(req.query.image.imageID)
            if (result_delete == 204) {
                var result_delete_image = await queryMysql.delete(`delete from image where id=${req.query.image.id}`)
            }
            res.json(true)
        } catch (e) {
            console.log(e)
        }
    }

    async deleteProduct(req, res) {
        try {
            var images = await queryMysql.queryMany(`select * from image where productID=${req.query.productID}`)
            images.forEach(async img => {
                var result_delete = upload.deleteFile(img.imageID)
                let result = await queryMysql.delete(`delete from image where id=${img.id}`)
            })
            let result_delete_product = await queryMysql.delete(`delete from product where id=${req.query.productID}`)
            res.json(true)
        } catch (e) {
            console.log(e)
        }
    }

    async getAllCategory(req, res) {
        try {
            let list = await queryMysql.queryMany(`select * from category`)
            res.json(list)
        } catch (e) {
            console.log(e)
        }
    }

    async addCategory(req, res) {
        try {
            if (req.body.category_name.length > 0) {
                var result_add_category = await queryMysql.insert(`insert into category(name, slug) value('${req.body.category_name}','${slug(req.body.category_name)}')`)
                if (result_add_category.insertId > 0) {
                    res.json({
                        id: result_add_category.insertId,
                        name: req.body.category_name,
                        slug: slug(req.body.category_name)
                    })
                } else {
                    res.json(false)
                }
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async deleteCategory(req, res) {
        try {
            var result = await queryMysql.delete(`delete from category where id=${req.query.id}`)
            if (result.affectedRows > 0) {
                res.json(true)
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async updateCategory(req, res) {
        try {
            if (req.body.slug.indexOf(' ') < 0) {
                var result = await queryMysql.update(`update category set name='${req.body.name}', slug='${req.body.slug}' where id=${req.body.id}`)
                if (result.affectedRows > 0) {
                    res.json(true)
                } else {
                    res.json(false)
                }
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async getAllBrand(req, res) {
        try {
            let list = await queryMysql.queryMany(`select * from brand`)
            res.json(list)
        } catch (e) {
            console.log(e)
        }
    }

    async addBrand(req, res) {
        try {
            if (req.body.name.length > 0) {
                var result = await queryMysql.insert(`insert into brand(name) value('${req.body.name}')`)
                if (result.insertId > 0) {
                    res.json({
                        id: result.insertId,
                        name: req.body.name
                    })
                }
            }
            res.json(false)
        } catch (e) {
            console.log(e)
        }
    }

    async deleteBrand(req, res) {
        try {
            var result = await queryMysql.delete(`delete from brand where id=${req.query.id}`)
            if (result.affectedRows > 0) {
                res.json(true)
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async updateBrand(req, res) {
        try {
            if (req.body.name.length > 0) {
                var result = await queryMysql.update(`update brand set name='${req.body.name}' where id=${req.body.id}`)
                if (result.affectedRows > 0) {
                    res.json(true)
                } else {
                    res.json(false)
                }
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async getAllVoucher(req, res) {
        try {
            var vouchers = await queryMysql.queryMany(`select * from voucher`)
            vouchers.forEach(async voucher => {
                let date = new Date(voucher.create_date)
                let obj_time = {
                    minute: date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
                    hour: date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
                    day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
                    month: (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
                    year: date.getFullYear() < 10 ? '0' + date.getFullYear() : date.getFullYear(),
                }
                voucher.create_date = obj_time
            })
            res.json(vouchers.reverse())
        } catch (e) {
            console.log(e)
        }
    }

    async deleteVoucher(req, res) {
        try {
            var result = await queryMysql.delete(`delete from voucher where id=${req.query.id}`)
            if (result.affectedRows > 0) {
                res.json(true)
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async updateVoucher(req, res) {
        try {
            var result = await queryMysql.delete(`update voucher set amount=${req.body.amount} where id=${req.body.id}`)
            if (result.affectedRows > 0) {
                res.json(true)
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async giveVoucher(req, res) {
        try {
            var customer = await queryMysql.queryOne(`select email from  account, customer, ${'`order`'} where account.id=customer.accountID and order.customerID=customer.id and order.id=${req.body.orderID}`)
            var order = await queryMysql.queryOne(`select total_amount, has_voucher, customerID from ${'`order`'} where id=${req.body.orderID}`)
            if (order.total_amount >= 1000000 && order.has_voucher == false) {
                if (order.total_amount >= 1000000) {
                    let date = new Date()
                    let voucher_code = generateRandomStringVoucherCode()
                    let amount = 0
                    if (order.total_amount >= 1000000) {
                        amount = 40000
                    }
                    if (order.total_amount >= 10000000) {
                        amount = 100000
                    }
                    if (order.total_amount >= 20000000) {
                        amount = 150000
                    }
                    if (order.total_amount >= 30000000) {
                        amount = 200000
                    }
                    if (order.total_amount >= 40000000) {
                        amount = 300000
                    }
                    if (order.total_amount >= 50000000) {
                        amount = 500000
                    }
                    let update_order = await queryMysql.update(`update ${'`order`'} set has_voucher=true where id=${req.body.orderID}`)
                    let result_create_voucher = await queryMysql.insert(`insert into voucher(customerID, voucher_code, is_used, create_date, amount) value(${order.customerID}, '${voucher_code}', false, '${date.toJSON()}', ${amount})`)
                    var transporter = nodemailer.createTransport({ // config mail server
                        service: 'Gmail',
                        auth: {
                            user: 'tuanem2503@gmail.com',
                            pass: 'mnxfxgdflwhbpksu'
                        }
                    });
                    var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
                        from: 'Tuan Em',
                        to: customer.email,
                        subject: 'TechZ GỬI MÃ GIẢM GIÁ',
                        text: 'You recieved message from ' + 'tuanem2503@gmail.com',
                        html: `<div class="box" style="font-family: Arial, Helvetica, sans-serif; padding: 1em; background-color: green; color: white;">
                                    <h1 style="margin: 0; padding: 0; text-align: center;">TechZ cảm ơn đã mua hàng</h1>
                                    <p style="margin: 0; padding: 0; font-size: 20px;">Gửi bạn mã giảm giá cho lần mua tiếp theo</p>
                                    <h2 style="margin: 0; padding: 0;">Mã giảm giá: ${voucher_code}</h2>
                            </div>`
                    }
                    transporter.sendMail(mainOptions, function (err, info) {
                        if (err) {
                            console.log(err);
                            res.redirect('/');
                        } else {
                            console.log('Message sent: ' + info.response);
                            res.redirect('/');
                        }
                    });
                    if (result_create_voucher.insertId) {
                        res.send(true)
                        return
                    }
                }
            }
        } catch (e) {
            console.log(e)
        }
        res.json(false)
    }

}

module.exports = new Admin