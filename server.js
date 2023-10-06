/* ########################################## */
/* ### IMPORTS ############################## */
/* ########################################## */

/* --- EXPRESS --- */
const express = require('express')
const app = express()
const path = require(`path`)
app.use(express.urlencoded({ extended: true}))

/* --- HANDLE BAR --- */
const exphbs = require("express-handlebars")
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }))
app.set("view engine", ".hbs")

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

/* --- ACCESS --- */
const ACTIVE_DB = "gbc_restaurant_db"
const USERNAME = "rafaelturse"
const PASSWORD = "qBnX8Z0RH96IP8Sg"
/* --- GENERAL --- */
const DATABASE_CONNECTED = `>>> DEBUG: MongoDB - Connected successfully to database: ${ACTIVE_DB}`
const DATABASE_ERROR_TO_CONNECTED = `>>> DEBUG: MongoDB - Error connecting to database: ${ACTIVE_DB}`

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
/* ### ENDPOINTS ############################ */
/* ########################################## */

/* --- CREATE --- */
app.get(`/`, (req, res) => {
   console.log(">>> DEBUG: this is root")
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