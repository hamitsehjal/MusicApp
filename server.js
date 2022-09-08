const express = require("express")
var app = express();

// importing path module
var path = require("path")

// importing music-service.js module
var musicService = require("./music-service.js")
var HTTP_PORT = process.env.PORT || 8080;

// importing multer, cloudinary and streamifier
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const streamifier = require("streamifier")

// Configuring Cloudinary
// 
cloudinary.config({
    cloud_name: 'dj4nx9iwk',
    api_key: '219615635789477',
    api_secret: 'OdmP-QoKDRmGihgxJNdTZGa_OOY',
    secure: true
})

// SETTING A CALLBACK FUNCTION
function OnHttpStart() {
    console.log("HTTP Server listening on Port " + HTTP_PORT)
}

// setting up the middleware to serve static resources correctly
app.use(express.static('public'))
// SETTING A ROUTE TO LISTEN ON DEFAULT URL (i.e localhost)
app.get('/', function (req, res) {
    res.redirect('/about')
})

// SETTING UP A ROUTE TO LISTEN ON "/about"
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"))
})

// SETTING UP A ROUTE TO LISTEN ON "/albums"
app.get('/albums', (req, res) => {
    musicService.getAllAlbums().then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json({ "msg": err })
    })
})

// SETTING UP THE ROUTE TO LISTEN ON "/albums/add"
app.get('/albums/add', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/addAlbum.html'))
})

// SETTING UP A ROUTE TO LISTEN ON "/genres"
app.get('/genres', (req, res) => {
    musicService.getAllGenres().then((data) => {
        res.json(data)
    }).catch((err) => {
        res.json({ "msg": err })
    })
})

// SETTING UP A 404 PAGE
app.use((req, res) => {
    res.status(404).send("Page not Found!!")
})


// SETTING UP THE SERVER TO LISTEN ON PORT(8080)
musicService.initialize().then(() => {
    app.listen(HTTP_PORT, OnHttpStart)
}).catch((err) => {
    res.json({ "msg": err })
})
