/* ########################################## */
/* ### SETUP ################################ */
/* ########################################## */

/* --- EXPRESS --- */
const express = require('express')
const app = express()
const path = require(`path`)

/* --- HANDLE BAR --- */
const exphbs = require("express-handlebars")
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }))
app.set("view engine", ".hbs")

/* --- MULTER --- */
const multer = require("multer")
const myStorage = multer.diskStorage({
    destination: "assets/img/driver",
    filename: function(req, file, cb){
        cb(null , `${Date.now()}-driver-${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage: myStorage})

/* --- SESSION --- */
const session = require('express-session')
app.use(session({
    secret: 'gbc-restaurant', //any random string used for configuring the session
    resave: false,
    saveUninitialized: true
}))

/* ########################################## */
/* ### ACCESS ############################### */
/* ########################################## */

/* --- PORT --- */
const HTTP_PORT = process.env.PORT || 8080

/* --- ASSETS --- */
app.use(express.static("assets"))

/* --- FORM --- */
app.use(express.urlencoded({ extended: true }))

/* ########################################## */
/* ### DB ################################### */
/* ########################################## */

/* --- ACCESS --- */
const ACTIVE_DB = "gbc_restaurant_db"
const USERNAME = "rafaelturse"
const PASSWORD = "qBnX8Z0RH96IP8Sg"

/* --- CONNECTION STRING --- */
const mongoose = require("mongoose")
const { log } = require('console')
const CONNECTION_STRING = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.h1rrj2i.mongodb.net/${ACTIVE_DB}?retryWrites=true&w=majority`
mongoose.connect(CONNECTION_STRING)

/* --- CHECKING CONNECTION --- */
const db = mongoose.connection
db.on("error", console.error.bind(console, `>>> DEBUG: MongoDB - Error connecting to database: ${ACTIVE_DB}`))
db.once("open", () => { console.log(`>>> DEBUG: MongoDB - Connected successfully to database: ${ACTIVE_DB}`) })

/* ########################################## */
/* ### SCHEMA ############################### */
/* ########################################## */

/* --- SCHEMA INSTANCE --- */
const Schema = mongoose.Schema

/* --- DRIVER --- */
const driverSchema = new Schema({
    fullname:String, 
    phone:Number,
    license_plate:String, 
    vehicle_model:String, 
    vehicle_color:String, 
    username:String,
    password:String
})
const Driver = mongoose.model("driver_collection", driverSchema)

/* --- ORDER --- */
const orderSchema = new Schema({
    order_number:String, 
    menu_item:String, 
    order_date:String,
    order_status:String,
    order_driver:String,
    proof_photo:String
})
const Order = mongoose.model("order_collection", orderSchema)

/* ########################################## */
/* ### FUNCTIONS ############################ */
/* ########################################## */

const checkEmpty = (value)  => {
    if (value !== undefined && value !== "") { return true }
    return false
}

/* --- A MIDDLEWARE TO ENSURE ACCESS ONLY BY LOGGED USERS --- */
const ensureLogin = (req, res, next) => {
    //if user has logged in, allow access
    if (req.session.isLoggedIn !== undefined && 
        req.session.isLoggedIn && 
        req.session.user !== undefined){
        next()
    } else {
        console.log(`>>> DEBUG: driver user not logged in!`)

        return res.render("header-template", {
            layout: "login",
            missingCredentialMessage: 
                `<strong>Driver user not logged in!</strong> 
                Please, make sure you are logged in before accessing the available orders.`
        })
    }
}

/* ########################################## */
/* ### TESTING DB ENDPOINTS ################# */
/* ########################################## */

app.get(`/testing-get-orders`, async (req, res) => {
    console.log(">>> DEBUG: this is orders' collection")

    results = await Order.find().lean().exec()

    console.log(`>>> DEBUG: ${JSON.stringify(results)}`)
    console.log(results)

    res.send("")
})

app.get(`/testing-get-drivers`, async (req, res) => {
    console.log(">>> DEBUG: this is drivers' collection")

    results = await Driver.find().lean().exec()

    console.log(`>>> DEBUG: ${JSON.stringify(results)}`)
    console.log(results)

    res.send("")
})

/* ########################################## */
/* ### LOGIN ENDPOINTS ###################### */
/* ########################################## */

/* --- ROOT --- */
app.get("/", (req, res) => {
    console.log(">>> DEBUG: this is the root, redirecting to driver login page")

    res.redirect("/login")
})

/* --- GET LOGIN PAGE --- */
app.get("/login", (req, res) => {
    console.log(">>> DEBUG: this is driver login page")

    res.render("header-template", { layout:"login" })
})

/* --- LOGIN VALIDATION --- */
app.post("/login", async (req, res) => {
    console.log(">>> DEBUG: checking driver credentials")

    const usernameFromUI = req.body.username
    const passwordFromUI = req.body.password

    //ERROR: if empty username or password
    if (!checkEmpty(usernameFromUI) || !checkEmpty(passwordFromUI)) {
        console.log(`>>> DEBUG: driver missing credentials:`)
        console.log(`>>> DEBUG: catch: (user: ${usernameFromUI} | password: ${passwordFromUI})`)

        return res.render("header-template", {
            layout: "login",
            message: 
                `<strong>ERROR: Missing Credentials!</strong> 
                Please, reenter driver <strong>username</strong> or <strong>password</strong>.`
        })
    } 

    try {
        //DB: driver search 
        const driver = await Driver.findOne(
            { username:usernameFromUI, password:passwordFromUI }
        ).lean().exec()
        
        //ERROR: if driver not found
        if (driver === null) {
            console.log(`>>> DEBUG: driver not found! Please, contact ADMIN.`)
            console.log(`>>> DEBUG: catch: (user: ${usernameFromUI} | password: ${passwordFromUI})`)

            return res.render("header-template", {
                layout: "login",
                message: 
                    `<strong>ERROR: Driver not Found!</strong> 
                    Please, reenter driver <strong>username</strong> and <strong>password</strong> 
                    or <strong>contact ADMIN</strong>.` 
            })
        } else {
            //SUCCESS: driver found, redirecting to driver-orders page
            console.log(`>>> DEBUG: user: ${driver.username} successfully found.`)
            console.log(`>>> DEBUG: catch: (user: ${usernameFromUI} | password: ${passwordFromUI})`)

            //SESSION IN
            req.session.user = {
                uname: driver.username,
                password: driver.password,
            }
            req.session.isLoggedIn = true
            req.session.fullname = driver.fullname
            req.session.phone = driver.phone
            req.session.license_plate = driver.license_plate
            req.session.vehicle_model = driver.vehicle_model
            req.session.vehicle_color = driver.vehicle_color
            req.session.username = driver.username

            res.redirect("/driver-orders")
        }
    } catch (error) {
        console.log(`>>> DEBUG: Error to to persist database: ${ACTIVE_DB}, please try again!`)
        console.log(`>>> DEBUG: ERROR > ${error}`)

        return res.render("header-template", {
            layout: "login",
            message: `<strong>ERROR</strong> to to persist database: ${ACTIVE_DB}, please try again!` 
        })
    }
})

/* --- LOGOUT --- */
app.get("/logout", async (req, res) => {
    console.log(">>> DEBUG: successfully logged out.")
    req.session.destroy()
    res.redirect("/login")
})

/* ########################################## */
/* ### DRIVER ORDERS ENDPOINTS ############## */
/* ########################################## */

/* --- GET DRIVER-ORDERS --- */
app.get("/driver-orders", ensureLogin, async (req, res) => {
    console.log(`>>> DEBUG: this is driver orders page`)

    try {
        //DB: available orders search 
        const orders = await Order.find(
            { 
                order_status:"READY FOR DELIVERY",
                order_driver:""
            }
        ).lean().exec()

        //ALERT: if orders not available
        if (orders.length === 0) {
            console.log(`>>> DEBUG: no available orders.`)

            return res.render("header-template", {
                layout: "driver-orders",
                fullname: req.session.fullname,
                phone: req.session.phone,
                license_plate: req.session.license_plate,
                vehicle_model: req.session.vehicle_model,
                vehicle_color: req.session.vehicle_color,
                username: req.session.username,
                availableOrdersMessage: `<strong>ALERT:</strong> No available orders.`
            })
        } else {
            console.log(`>>> DEBUG: this is available orders.`)

            return res.render("header-template", {
                layout: "driver-orders",
                fullname: req.session.fullname,
                phone: req.session.phone,
                license_plate: req.session.license_plate,
                vehicle_model: req.session.vehicle_model,
                vehicle_color: req.session.vehicle_color,
                username: req.session.username,
                orders: orders
            })
        }
    } catch (error) {
        console.log(`>>> DEBUG: Error to to persist database: ${ACTIVE_DB}, please try again!`)
        console.log(`>>> DEBUG: ERROR > ${error}`)

        return res.render("header-template", {
            layout: "driver-orders",
            message: `<strong>ERROR</strong> to to persist database: ${ACTIVE_DB}, please try again!` 
        })
    }
})

/* --- ASSIGN DRIVER TO ORDER --- */
app.post("/assign-driver-to-order/:order_number", async (req, res) => {
    console.log(">>> DEBUG: assigning driver to the order.")

    const order_number = req.params.order_number

    try {
        //DB: order search 
        const order = await Order.findOne({ order_number:order_number })

        //ERROR: if orders not available
        if (order === null) {
            console.log(`>>> DEBUG: order: ${order_number}, not found.`)

            res.redirect("/driver-orders")
        } else {
            console.log(`>>> DEBUG: order: ${order_number}, found.`)

            //set update values
            const updatedValues = { 
                order_status:"IN TRANSIT",
                order_driver:req.session.username 
            }

            //assigning driver to order
            const result = await order.updateOne(updatedValues)

            if (result !== null) {
                console.log(`>>> DEBUG: order: ${order_number}, assigned to driver: ${req.session.username}`)
    
                res.redirect("/driver-orders")
            } else {
                console.log(`>>> DEBUG: order: ${order_number} update has failed, please, try again!`)

                res.redirect("/driver-orders")
            }
        }
    } catch (error) {
        console.log(`>>> DEBUG: Error to to persist database: ${ACTIVE_DB}, please try again!`)
        console.log(`>>> DEBUG: ERROR > ${error}`)

        return res.render("header-template", {
            layout: "driver-orders",
            message: `<strong>ERROR</strong> to to persist database: ${ACTIVE_DB}, please try again!` 
        })
    }
})

/* ########################################## */
/* ### SERVER START ######################### */
/* ########################################## */

/* --- START LOG --- */
const onHTTPStart = () => {
    console.log(`>>> DEBUG: Server has ReadableStreamDefaultReader.`)
    console.log(`>>> DEBUG: Visit http://localhost:${HTTP_PORT}`)
    console.log(`>>> DEBUG: User CTRL + C to stop the server`)
}

/* --- LISTEN --- */
app.listen(HTTP_PORT, onHTTPStart)