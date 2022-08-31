const express = require("express")
var app = express();

// importing path module
var path = require("path")

var HTTP_PORT = process.env.PORT || 8080;

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


// SETTING UP THE SERVER TO LISTEN ON PORT(8080)
app.listen(HTTP_PORT, OnHttpStart)