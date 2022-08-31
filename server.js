const express = require("express")
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

// SETTING A CALLBACK FUNCTION
function OnHttpStart() {
    console.log("HTTP Server listening on Port " + HTTP_PORT)
}

// SETTING A ROUTE TO LISTEN ON DEFAULT URL (i.e localhost)
app.get('/', function (req, res) {
    res.send("Hello Everyone!!\n"+
    "I am Hamit and I will be your Co-op Tutor for this Fall Semester")
})

// SETTING UP THE SERVER TO LISTEN ON PORT(8080)
app.listen(HTTP_PORT, OnHttpStart)