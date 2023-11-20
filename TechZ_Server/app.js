const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require("bcrypt")
const cors = require('cors')

const pageRouter = require('./router/page.router')
const apiRouter = require('./router/api.router')
const adminRouter = require('./router/admin.router')
const paymentRouter = require('./router/payment.router')

const mysql = require('./mysql/query.mysql')
const queryMysql = require('./mysql/query.mysql')

const app = express()

app.use(cors())
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieSession({
    name: 'session',
    keys: ['25032002'],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('views', './views')
app.use(cookieParser())
app.use(express.static('./public'))

passport.serializeUser(function (accountID, done) {
    done(null, accountID);
});

passport.deserializeUser(async function (account, done) {
    try {
        const customer = await mysql.queryOne(`select * from customer where accountID=${account.id};`)
        if (customer?.id) {
            done(null, customer)
        } else {
            done(null, false, { message: 'Incorrect username and password' })
        }
    } catch (err) {
        console.log(err)
    }
});

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
},
    async function (req, email, password, done) {
        try {
            const account = await mysql.queryOne(`select * from account where email='${email}'`)
            if (account.id && account.password != null) {
                let checkPass = await bcrypt.compare(password, account.password)
                if (checkPass) {
                    return done(null, account);
                } else {
                    return done(null, false, { message: 'Incorrect username and password' });
                }
            } else {
                return done(null, false, { message: 'Incorrect username and password' });
            }
        } catch (e) {
            console.log(e)
        }
    }
));

passport.use(
    new GoogleStrategy(
        {
            clientID: '',
            clientSecret: '',
            callbackURL: ''
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                let account = await queryMysql.queryOne(`select id from account where email='${profile.emails[0].value}'`)
                if (account?.id) {
                    done(null, account)
                } else {
                    let date = new Date()
                    let result = await queryMysql.insert(`insert into account(email,created_date, role) value('${profile.emails[0].value}','${date.toJSON()}',0)`)
                    if (result?.insertId > 0) {
                        let result_create_customer = await queryMysql.insert(`insert into customer(accountID, name)value(${result.insertId},'${profile.displayName}')`)
                        done(null, {id: result.insertId})
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
    )
);

app.use(async (req, res, next) => {
    try {
        if (req.user) {
            let count_cart = await queryMysql.queryOne(`select count(id) count from cart where customerID=${req.user.id}`)
            if (count_cart.count == 0) {
                let result_create_cart = await queryMysql.insert(`insert into cart(customerID)value(${req.user.id})`)
            }
            let count_order = await mysql.queryOne(`select count(id) count from item where orderID IS NULL and cartID in (select id from cart where customerID=${req.user.id})`)
            req.quantity_order = count_order.count
        }
    } catch (e) {
        console.log(e)
    }
    next()
})

app.use('/', pageRouter)
app.use('/', paymentRouter)
app.use('/admin', adminRouter)
app.use('/api', apiRouter)
app.get(
    '/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);
app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => { res.redirect('/') });
app.listen(3000)