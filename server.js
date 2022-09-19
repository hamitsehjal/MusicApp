const express = require("express")
var app = express();

// importing path module
var path = require("path")

// importing music-service.js module
var musicService = require("./music-service.js")
var HTTP_PORT = process.env.PORT || 8080;

// importing configured multer and cloudinary
const upload = require('./utils/multer.js')
const { cloudinary } = require('./utils/cloudinary.js')

// importing handlebars
const exphbs = require('express-handlebars')

// Our server needs to know how to handle the HTML files that are formatted using handlebars
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')

// setting up the middleware for size of files to be uploaded
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// SETTING A CALLBACK FUNCTION
function OnHttpStart() {
    console.log("HTTP Server listening on Port " + HTTP_PORT + "🎵🎵🎵🎵")
}

// SETTING A ROUTE TO LISTEN ON DEFAULT URL (i.e localhost)
app.get('/', function (req, res) {
    res.redirect('/about')
})

// SETTING UP A ROUTE TO LISTEN ON "/about"
app.get('/about', (req, res) => {
    //res.sendFile(path.join(__dirname, "/views/about.html"))
    res.render('about')
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

app.post('/albums/add', upload.single('AlbumCover'), async (req, res, next) => {

    //For *programmer's understanding
    console.log("File Details for Mr.Hamit:\n", req.file);
    console.log("Files Uploaded!!!!")

    if (req.file) {
        //console.log("It's working!!!!!!")
        //cloudinary.v2.uploader.upload(file, options).then(callback);

        const results = await cloudinary.uploader.upload(req.file.path)

        console.log("Results: ", results) //For *programmer's understanding

        var post_results = {
            title: req.body.Title, // to access textual data of form, use req.body
            image: results.public_id
        }

    }

    res.status(200).json({ post_results })

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
