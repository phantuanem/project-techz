const queryMysql = require('../mysql/query.mysql')
const bcrypt = require("bcrypt")
const saltRounds = 10

class ApiController {
    async page(req, res) {
        try {
            var list = await queryMysql.queryMany(`SELECT p.id, p.name, p.price, p.sale_price, SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.url ORDER BY img.id ASC), ',', 1) AS url
            FROM product AS p
            INNER JOIN image AS img ON p.id = img.productID
            WHERE p.categoryID in (SELECT id FROM category WHERE slug='${req.params.slug}')
            AND p.brandID=${req.params.id} AND p.id>${req.query.productID}
            GROUP BY p.id
            LIMIT 10`)

            var count_product = await queryMysql.queryOne(`select count(id) as count from product as p
            WHERE p.categoryID in (SELECT id FROM category WHERE slug='${req.params.slug}')
            AND p.brandID=${req.params.id} AND p.id>${req.query.productID}`)

            res.json({
                list,
                count: count_product.count - 10
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
            WHERE lower(p.name) LIKE '%${req.query.search.toLowerCase()}%' AND p.id>${req.query.productID}
            GROUP BY p.id
            LIMIT 10`)

            var count_product = await queryMysql.queryOne(`select count(id) as count from product as p
            WHERE lower(p.name) LIKE '%${req.query.search.toLowerCase()}%' AND p.id>${req.query.productID}`)

            res.json({
                list,
                count: count_product.count - 10
            })
        } catch (e) {
            console.log(e)
        }
    }

    async handleRegister(req, res) {
        try {
            console.log(req.body)
            if (req.body.name && req.body.email && req.body.password && req.body.password.length >= 6) {
                let countEmail = await queryMysql.queryOne(`select count(email) as count from account where email='${req.body.email}'`)
                if (countEmail.count == 0) {
                    let date = new Date()
                    let hash = await bcrypt.hash(req.body.password, saltRounds)
                    let result = await queryMysql.insert(`insert into account(email, password, created_date, role) values('${req.body.email}','${hash}', '${date.toString()}', 0)`)
                    if (result.insertId > 0) {
                        let result_user = await queryMysql.insert(`insert into customer(accountID, name)values(${result.insertId},'${req.body.name}')`)
                        if (result_user.insertId > 0) {
                            res.json(true)
                        }
                    } else {
                        res.json(false)
                    }
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

    loginSuccess(req, res) {
        res.json(true)
    }

    loginFail(req, res) {
        res.json(false)
    }

    async addToCard(req, res) {
        try {
            if (req.user) {
                let count_product = await queryMysql.queryOne(`select count(id) as count from item where productID=${req.body.id} and orderID IS NULL and cartID in (select id from cart where customerID=${req.user.id})`)
                if (count_product.count > 0) {
                    let result_increase = await queryMysql.queryMany(`update item set quantity = quantity + 1 where productID=${req.body.id} and orderID IS NULL and cartID in (select id from cart where customerID=${req.user.id})`)
                    if (result_increase.affectedRows > 0) {
                        res.json(true)
                    } else {
                        res.json(false)
                    }
                } else {
                    let result_add_to_card = await queryMysql.insert(`INSERT INTO item (cartID, productID ,quantity)
                        SELECT id, ${req.body.id}, 1
                        FROM cart
                        WHERE customerID = ${req.user.id}`)
                    if (result_add_to_card.affectedRows > 0) {
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

    async removeOrder(req, res) {
        try {
            const result = await queryMysql.delete(`delete from item where id=${req.query.id}`)
            if (result.affectedRows > 0) {
                res.json(true)
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async increaseQuantityCartItem(req, res) {
        try {
            req.query.quantity = JSON.parse(req.query.quantity) + 1
            let result_update_quenrity = await queryMysql.update(`update item set quantity=${req.query.quantity} where id=${req.query.id_cart_item}`)
            if (result_update_quenrity.affectedRows > 0) {
                res.json(true)
            } else {
                res.json(false)
            }
        } catch (e) {
            console.log(e)
        }
    }

    async reduceQuantityCartItem(req, res) {
        try {
            req.query.quantity = JSON.parse(req.query.quantity) - 1
            if (req.query.quantity > 0) {
                let result_update_quenrity = await queryMysql.update(`update item set quantity=${req.query.quantity} where id=${req.query.id_cart_item}`)
                if (result_update_quenrity.affectedRows > 0) {
                    res.json(true)
                } else {
                    res.json(false)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    async filterProduct(req, res) {
        let list = []
        let count_product = []
        try {
            console.log(req.query)
            if (req.query.ram == 0 && req.query.monitor=='0' && req.query.ssd=='0') {
                list = await queryMysql.queryMany(`SELECT p.id, p.name, p.price, p.sale_price, SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.url ORDER BY img.id ASC), ',', 1) AS url
                                                FROM desc_title AS dt
                                                INNER JOIN desc_content AS dc ON dt.id = dc.titleID
                                                INNER JOIN product as p on p.id=dt.productID
                                                INNER JOIN image AS img ON p.id = img.productID
                                                WHERE p.brandID=${req.query.brandID}
                                                GROUP BY p.id
                                                LIMIT 10`)
                count_product = await queryMysql.queryMany(`SELECT p.id FROM product AS p
                                                INNER JOIN category as ct on ct.id=p.categoryID
                                                WHERE p.brandID=${req.query.brandID} and ct.slug='laptop'
                                                GROUP BY p.id`)
            } else {
                list = await queryMysql.queryMany(`SELECT p.id, p.name, p.price, p.sale_price, SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.url ORDER BY img.id ASC), ',', 1) AS url
                                                FROM desc_title AS dt
                                                INNER JOIN desc_content AS dc ON dt.id = dc.titleID
                                                INNER JOIN product as p on p.id=dt.productID
                                                INNER JOIN image AS img ON p.id = img.productID
                                                WHERE p.brandID=${req.query.brandID} AND
                                                LOWER(title) LIKE '%ram%' AND LOCATE('${req.query.ram == 0 ? '' : req.query.ram}', dc.content) = 1 AND 
                                                p.id in (SELECT p.id
                                                    FROM desc_title AS dt
                                                    INNER JOIN desc_content AS dc ON dt.id = dc.titleID
                                                    INNER JOIN product as p on p.id=dt.productID
                                                    INNER JOIN image AS img ON p.id = img.productID
                                                    WHERE LOWER(title) LIKE '%man hinh%' AND LOCATE('${req.query.monitor == 0 ? '' : req.query.monitor}', dc.content) = 1 AND
                                                    p.id in (SELECT p.id
                                                        FROM desc_title AS dt
                                                        INNER JOIN desc_content AS dc ON dt.id = dc.titleID
                                                        INNER JOIN product as p on p.id=dt.productID
                                                        INNER JOIN image AS img ON p.id = img.productID
                                                        WHERE LOWER(title) LIKE '%o cung%' AND LOCATE('${req.query.ssd == 0 ? '' : req.query.ssd == 1 ? '1T' : req.query.ssd}', dc.content) = 1
                                                        GROUP BY p.id)
                                                    GROUP BY p.id)
                                                GROUP BY p.id
                                                LIMIT 10`)
                count_product = await queryMysql.queryMany(`SELECT p.id
                                                FROM desc_title AS dt
                                                INNER JOIN desc_content AS dc ON dt.id = dc.titleID
                                                INNER JOIN product as p on p.id=dt.productID
                                                INNER JOIN image AS img ON p.id = img.productID
                                                WHERE p.brandID=${req.query.brandID} AND
                                                LOWER(title) LIKE '%ram%' AND LOCATE('${req.query.ram == 0 ? '' : req.query.ram}', dc.content) = 1 AND 
                                                p.id in (SELECT p.id
                                                    FROM desc_title AS dt
                                                    INNER JOIN desc_content AS dc ON dt.id = dc.titleID
                                                    INNER JOIN product as p on p.id=dt.productID
                                                    INNER JOIN image AS img ON p.id = img.productID
                                                    WHERE LOWER(title) LIKE '%man hinh%' AND LOCATE('${req.query.monitor == 0 ? '' : req.query.monitor}', dc.content) = 1 AND
                                                    p.id in (SELECT p.id
                                                        FROM desc_title AS dt
                                                        INNER JOIN desc_content AS dc ON dt.id = dc.titleID
                                                        INNER JOIN product as p on p.id=dt.productID
                                                        INNER JOIN image AS img ON p.id = img.productID
                                                        WHERE LOWER(title) LIKE '%o cung%' AND LOCATE('${req.query.ssd == 0 ? '' : req.query.ssd == 1 ? '1T' : req.query.ssd}', dc.content) = 1
                                                        GROUP BY p.id)
                                                    GROUP BY p.id)
                                                GROUP BY p.id`)
            }
            res.json({
                list,
                count: count_product.length > list.length ? count_product.length - 10 : 0
            })
        } catch (e) {
            console.log(e)
        }
    }

    async getVoucher(req, res) {
        try {
            let result = await queryMysql.queryOne(`select amount from voucher where voucher_code='${req.query.voucher_code}' and is_used=false and orderID is null`)
            res.json(result.amount)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new ApiController