let express = require('express');
let router = express.Router();
let $ = require('jquery');
const request = require('request');
const moment = require('moment');
const queryMysql = require('../mysql/query.mysql')
const nodemailer = require('nodemailer');
const { resume } = require('../mysql/connect');

var config = {
    vnp_TmnCode: "S309YLRP",
    vnp_HashSecret: "UDABDJIZLXQOEUKJMRFRBYTGCQSBYNFM",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
    vnp_ReturnUrl: "http://localhost:3000/order/vnpay_return"
}

router.post('/create_payment_url', async function (req, res, next) {
    try {
        var voucher = null
        if(req.query?.voucher_code){
            voucher = await queryMysql.queryOne(`select voucher_code, amount from voucher where voucher_code='${req.query.voucher_code}'`)
        }
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

        if(voucher){
            sum_price = sum_price - voucher.amount
        }

        process.env.TZ = 'Asia/Ho_Chi_Minh';

        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');

        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let tmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnpUrl = config.vnp_Url;
        let returnUrl = config.vnp_ReturnUrl;
        let orderId = moment(date).format('DDHHmmss');
        let amount = sum_price;
        let bankCode = req.body.bankCode;

        let locale = 'vn'
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl + `?voucher_code=${voucher ? voucher.voucher_code:''}`;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        res.redirect(vnpUrl)
    } catch (e) {
        console.log(e)
    }
});

router.get('/vnpay_return', function (req, res, next) {
    try {
        let vnp_Params = req.query;

        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let tmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

            res.render('success', { code: vnp_Params['vnp_ResponseCode'] })
        } else {
            res.render('success', { code: '97' })
        }
    } catch (e) {
        console.log(e)
    }
});

router.get('/vnpay_ipn', function (req, res, next) {
    try {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];

        let orderId = vnp_Params['vnp_TxnRef'];
        let rspCode = vnp_Params['vnp_ResponseCode'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        let secretKey = config.vnp_HashSecret;
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
        //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
        //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

        let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
        let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
        if (secureHash === signed) { //kiểm tra checksum
            if (checkOrderId) {
                if (checkAmount) {
                    if (paymentStatus == "0") { //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                        if (rspCode == "00") {
                            //thanh cong
                            //paymentStatus = '1'
                            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                            res.status(200).json({ RspCode: '00', Message: 'Success' })
                        }
                        else {
                            //that bai
                            //paymentStatus = '2'
                            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                            res.status(200).json({ RspCode: '00', Message: 'Success' })
                        }
                    }
                    else {
                        res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' })
                    }
                }
                else {
                    res.status(200).json({ RspCode: '04', Message: 'Amount invalid' })
                }
            }
            else {
                res.status(200).json({ RspCode: '01', Message: 'Order not found' })
            }
        }
        else {
            res.status(200).json({ RspCode: '97', Message: 'Checksum failed' })
        }
    } catch (e) {
        console.log(e)
    }
});

router.post('/querydr', function (req, res, next) {
    try {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();

        let crypto = require("crypto");

        let vnp_TmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnp_Api = config.vnp_Api;1

        let vnp_TxnRef = req.body.orderId;
        let vnp_TransactionDate = req.body.transDate;

        let vnp_RequestId = moment(date).format('HHmmss');
        let vnp_Version = '2.1.0';
        let vnp_Command = 'querydr';
        let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;

        let vnp_IpAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        let currCode = 'VND';
        let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

        let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;

        let hmac = crypto.createHmac("sha512", secretKey);
        let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

        let dataObj = {
            'vnp_RequestId': vnp_RequestId,
            'vnp_Version': vnp_Version,
            'vnp_Command': vnp_Command,
            'vnp_TmnCode': vnp_TmnCode,
            'vnp_TxnRef': vnp_TxnRef,
            'vnp_OrderInfo': vnp_OrderInfo,
            'vnp_TransactionDate': vnp_TransactionDate,
            'vnp_CreateDate': vnp_CreateDate,
            'vnp_IpAddr': vnp_IpAddr,
            'vnp_SecureHash': vnp_SecureHash
        };
        // /merchant_webapi/api/transaction
        request({
            url: vnp_Api,
            method: "POST",
            json: true,
            body: dataObj
        }, function (error, response, body) {
            console.log(response);
        });
    } catch (e) {
        console.log(e)
    }
});

router.post('/refund', function (req, res, next) {
    try {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();

        let crypto = require("crypto");

        let vnp_TmnCode = config.vnp_TmnCode;
        let secretKey = config.vnp_HashSecret;
        let vnp_Api = config.vnp_Api;

        let vnp_TxnRef = req.body.orderId;
        let vnp_TransactionDate = req.body.transDate;
        let vnp_Amount = req.body.amount * 100;
        let vnp_TransactionType = req.body.transType;
        let vnp_CreateBy = req.body.user;

        let currCode = 'VND';

        let vnp_RequestId = moment(date).format('HHmmss');
        let vnp_Version = '2.1.0';
        let vnp_Command = 'refund';
        let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

        let vnp_IpAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;


        let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

        let vnp_TransactionNo = '0';

        let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
        let hmac = crypto.createHmac("sha512", secretKey);
        let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

        let dataObj = {
            'vnp_RequestId': vnp_RequestId,
            'vnp_Version': vnp_Version,
            'vnp_Command': vnp_Command,
            'vnp_TmnCode': vnp_TmnCode,
            'vnp_TransactionType': vnp_TransactionType,
            'vnp_TxnRef': vnp_TxnRef,
            'vnp_Amount': vnp_Amount,
            'vnp_TransactionNo': vnp_TransactionNo,
            'vnp_CreateBy': vnp_CreateBy,
            'vnp_OrderInfo': vnp_OrderInfo,
            'vnp_TransactionDate': vnp_TransactionDate,
            'vnp_CreateDate': vnp_CreateDate,
            'vnp_IpAddr': vnp_IpAddr,
            'vnp_SecureHash': vnp_SecureHash
        };

        request({
            url: vnp_Api,
            method: "POST",
            json: true,
            body: dataObj
        }, function (error, response, body) {
            console.log(response);
        });
    } catch (e) {
        console.log(e)
    }
});

router.get('/order/vnpay_return?', async function (req, res) {
    try {
        if (req.query.vnp_ResponseCode == '00') {

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

            if(result_voucher){
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
            let reult_create_bill = await queryMysql.insert(`insert into bill(orderID, total, bill_date, bank_code, payment_status, payment_method)value
                                                        (${result_create_order.insertId},${sum_price}, '${date}','${req.query.vnp_BankCode}',true,'VNPAY')`)
            let result_create_order_status = await queryMysql.insert(`insert into order_status(orderID, new)value(${result_create_order.insertId},true)`)
            if(result_voucher){
                let result_update_voucher = await queryMysql.update(`update voucher set is_used=true, orderID=${result_create_order.insertId} where voucher_code='${req.query.voucher_code}'`)
            }
        }
        return res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = router;