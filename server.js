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
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) { //custom helpers
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}))
app.set('view engine', '.hbs')

// This will add the property "activeRoute" to "app.locals" whenever the route changes, ie: 
// if our route is "/blog/5", the app.locals.activeRoute value will be "/blog ". 
// Also, if the blog is currently viewing a category, that category will be set in "app.locals".


app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = (route == "/") ? "/" : "/" + route.replace(/\/(.*)/, "");
    app.locals.viewingGenre = req.query.genre;
    next();
});


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
        res.render("albums", {albums: data})
    }).catch((err) => {
        res.render('ablums',{"msg":err})
    })
})

// SETTING UP THE ROUTE TO LISTEN ON "/albums/add"
app.get('/albums/add', (req, res) => {
    //res.sendFile(path.join(__dirname, '/views/addAlbum.html'))
    res.render('addAlbum')
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
        res.render('genres',{
            genres:data
        })
    }).catch((err) => {
        res.render('genres',{
            "msg":err
        })
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
