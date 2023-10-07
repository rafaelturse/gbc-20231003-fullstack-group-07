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
const session = require('express-session');
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
/* ### MESSAGES ############################# */
/* ########################################## */

const debug = (message) => { return `>>> DEBUG: ${message}` }

/* --- ACCESS --- */
const ACTIVE_DB = "gbc_restaurant_db"
const USERNAME = "rafaelturse"
const PASSWORD = "qBnX8Z0RH96IP8Sg"
/* --- DATA BASE --- */
const DATABASE_CONNECTED = `>>> DEBUG: MongoDB - Connected successfully to database: ${ACTIVE_DB}`
const DATABASE_ERROR_TO_CONNECTED = `>>> DEBUG: MongoDB - Error connecting to database: ${ACTIVE_DB}`
/* --- DEBUG --- */
const CHECKING_LOGIN = ">>> DEBUG: driver login checking"
const THIS_IS_DRIVERS = ">>> DEBUG: this is drivers' collection"
const THIS_IS_LOGIN = ">>> DEBUG: this is driver login"
const THIS_IS_ORDERS = ">>> DEBUG: this is orders' collection"
const THIS_IS_ROOT = ">>> DEBUG: this is root, redirecting to driver login"

/* ########################################## */
/* ### DB ################################### */
/* ########################################## */

/* --- CONNECTION STRING --- */
const mongoose = require('mongoose')
const CONNECTION_STRING = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.h1rrj2i.mongodb.net/${ACTIVE_DB}?retryWrites=true&w=majority`
mongoose.connect(CONNECTION_STRING)

/* --- CHECKING CONNECTION --- */
const db = mongoose.connection
db.on("error", console.error.bind(console, DATABASE_ERROR_TO_CONNECTED))
db.once("open", () => { console.log(DATABASE_CONNECTED) })

/* ########################################## */
/* ### SCHEMA ############################### */
/* ########################################## */

/* --- SCHEMA INSTANCE --- */
const Schema = mongoose.Schema

/* --- DRIVER --- */
const driverSchema = new Schema({
    fullName:String, 
    license_plate:String, 
    phone:Number,
    username:String,
    password:String
})
const Driver = mongoose.model("driver_collection", driverSchema)

/* --- ORDER --- */
const orderSchema = new Schema({
    order_number:String, 
    menu_item:String, 
    order_date:String,
    proof_photo:String,
    order_status:String
})
const Order = mongoose.model("order_collection", orderSchema)

/* ########################################## */
/* ### TESTING ENDPOINTS #################### */
/* ########################################## */

app.get(`/testing-get-orders`, async (req, res) => {
    console.log(THIS_IS_ORDERS)

    results = await Order.find().lean().exec()

    console.log(debug(JSON.stringify(results)))
    console.log(results)

    res.send("")
 })

app.get(`/testing-get-drivers`, async (req, res) => {
    console.log(THIS_IS_DRIVERS)

    results = await Driver.find().lean().exec()

    console.log(debug(JSON.stringify(results)))
    console.log(results)

    res.send("")
 })

/* ########################################## */
/* ### HOT ENDPOINTS ######################## */
/* ########################################## */

/* --- ROOT --- */
app.get("/", (req, res) => {
    console.log(THIS_IS_ROOT)

    res.redirect("/login")
})

/* --- GET LOGIN --- */
app.get("/login", (req, res) => {
    console.log(THIS_IS_LOGIN)

    res.render("header-template", { layout:"index" })
})

/* --- CHECK LOGIN --- */
app.post("/login", (req, res) => {
    console.log(CHECKING_LOGIN)

   
})

/* --- READ --- */

/* --- UPDATE --- */

/* --- DELETE --- */

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