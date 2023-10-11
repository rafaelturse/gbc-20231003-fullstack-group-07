/* ########################################## */
/* ### IMPORTS ############################## */
/* ########################################## */

/* --- EXPRESS --- */
const express = require('express')
const app = express()
const path = require(`path`)
const bodyParser = require("body-parser");
const RestaurantRouter = require(`./routes/Restaurant`);

/* --- HANDLE BAR --- */
const exphbs = require("express-handlebars")
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }))
app.set("view engine", ".hbs")

/* --- PORT --- */
const HTTP_PORT = process.env.PORT || 8080

/* --- ASSETS ACCESS --- */
app.use(express.static(path.join(__dirname, '/assets')));

/* ########################################## */
/* ### DB ################################### */
/* ########################################## */

/* --- CONNECTION STRING --- */
const mongoose = require('mongoose')
const CONNECTION_STRING = "mongodb+srv://quervolvh:eNCFrrrMIklQTJ2Q@t440-cluster.pgdxfdw.mongodb.net/t440-work?retryWrites=true&w=majority";

mongoose.connect(CONNECTION_STRING)

/* --- CHECK IF CONNECTION WAS SUCCESSFUL --- */
const db = mongoose.connection
db.on("error", console.error.bind(console, "Error connecting to database: "))
db.once("open", () => { console.log("Mongo DB connected successfully.") })

/* ########################################## */
/* ### ENDPOINTS ############################ */
/* ########################################## */

/* --- AUTHOR: [YOUR NAME] --- */

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(RestaurantRouter);

/* ########################################## */
/* ### SERVER START ######################### */
/* ########################################## */

/* --- START LOG --- */
const onHTTPStart = () => {
    console.log(`#######################################`)
    console.log(`Server has ReadableStreamDefaultReader.`)
    console.log(`Visit http://localhost:${HTTP_PORT}`)
    console.log(`#######################################`)
    console.log(`User CTRL + C to stop the server`)
    console.log(`#######################################`)
}

/* --- LISTEN --- */
app.listen(HTTP_PORT, onHTTPStart)