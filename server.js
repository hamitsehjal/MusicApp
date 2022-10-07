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

const stripJs = require('strip-js')
// Our server needs to know how to handle the HTML files that are formatted using handlebars
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
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
        },
        safeHTML: function (context) {
            return stripJs(context);
        },
        formatDate: function (dateObj) {
            let year = dateObj.getFullYear();
            let month = (dateObj.getMonth() + 1).toString();
            let day = dateObj.getDate().toString();
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        },


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
    res.redirect('/music')
})

// SETTING UP A ROUTE TO LISTEN ON "/about"
app.get('/about', (req, res) => {
    //res.sendFile(path.join(__dirname, "/views/about.html"))
    res.render('about')
})

//music?genre=1
// SETTING UP A ROUTE TO LISTEN ON "/music"
app.get('/music', async (req, res) => {

    //Declare an object to store the properties for the view
    let viewData = {};

    try {
        //Declaring empty array to hold "albums" object
        let albums = [];

        // In case, there's a "Genre" query, filter the returned albums by genre
        if (req.query.genre) {
            //Get all the albums by genre
            albums = await musicService.getAlbumsByGenre(req.query.genre);
        }
        else {
            // obtain all the albums
            albums = await musicService.getAllAlbums();
        }

        // sort the albums by "Released(Date) attribute"
        albums.sort((a, b) => new Date(b.Released) - new Date(a.Released))

        // Get the latest album from the front of the list (i.e element 0)
        let album = albums[0]

        // store the "albums" and "album" data in the viewData object (to be passed to the view)
        viewData.albums = albums;
        // console.log("(not ID ONE) All Albums are: ", albums)
        viewData.album = album;
        // console.log("(not ID ONE) Single Album is : ", album)
    } catch (err) {
        viewData.message = "NO RESULTS!!"
    }

    try {
        // Get full list of all Genres
        let genres = await musicService.getAllGenres();

        // store the "categories" data in the viewData object (to be passed to the view)
        viewData.genres = genres

    } catch (err) {
        viewData.categoriesMessage = "NO RESULTS!!"
    }

    // console.log("(NOT ID ONE) Value of ViewData is: ", viewData)
    // RENDER THE "music" view with all the data(i.e viewData)
    res.render('music', {
        data: viewData
    })
})

//music/1?genre=1
// SETTING UP A ROUTE TO LISTEN ON "/music/:id"
app.get("/music/:id", async (req, res) => {
    // Declare an object to store properties for the view
    let viewData = {};

    try {
        // declare empty array to hold "album" object
        let albums = []

        // if there's a "Genre" query, filter the returned albums by genre
        if (req.query.genre) {
            // obtain the albums by genre
            albums = await musicService.getAlbumsByGenre(req.query.genre)
        } else {
            // obtain the albums

            albums = await musicService.getAllAlbums();
        }

        // sort the albums by "Released(Date" attribute
        albums.sort((a, b) => new Date(b.Released) - new Date(a.Released))

        // store the albums data in viewData object
        viewData.albums = albums;
    } catch (err) {
        viewData.message = "SORRY, NO RESULTS FOUND!!😔😔😔"
    }

    try {
        // obtain albums by "id"
        let album = {};
        album = await musicService.getAlbumsById(req.params.id);
        viewData.album = album;

    } catch (err) {
        viewData.message = "SORRY, NO RESULTS FOUND!!😔😔😔";
    }

    try {
        // obtain the full list of genres
        viewData.genres = await musicService.getAllGenres();

    } catch (err) {
        viewData.categoriesMessage = "SORRY, NO RESULTS FOUND!!😔😔😔";
    }

    // console.log("(ID ONE) Value of ViewData is: ", viewData)
    // RENDER THE "music" view with all the data(i.e viewData)
    res.render('music', {
        data: viewData
    })

})

// SETTING UP A ROUTE TO LISTEN ON "/albums"
app.get('/albums', (req, res) => {
    //albums?genre=1
    if (req.query.genre) {
        musicService.getAlbumsByGenre(req.query.genre).then((data) => {
            if (data.length > 0) {
                res.render("albums", {
                    albums: data
                })
            }
            else {
                res.render('albums', {
                    message: "SORRY, NO RESULTS FOUND!!😔😔😔"
                })
            }

        }).catch((err) => {
            res.render('albums', {
                message: "SORRY, NO RESULTS FOUND!!😔😔😔"
            })
        })
    }
    else {
        musicService.getAllAlbums().then((data) => {
            if (data.length > 0) {
                res.render("albums", { albums: data })
            }
            else {
                res.render('albums', {
                    message: "SORRY, NO RESULTS FOUND!!😔😔😔"
                })

            }
        }).catch((err) => {
            res.render('albums', {
                message: "SORRY, NO RESULTS FOUND!!😔😔😔"
            })
        })
    }

})


// SETTING UP THE ROUTE TO LISTEN ON "/albums/add"
app.get('/albums/add', (req, res) => {
    //res.sendFile(path.join(__dirname, '/views/addAlbum.html'))
    res.render('addAlbum')
})

app.post('/albums/add', upload.single('AlbumCover'), async (req, res, next) => {

    //For *programmer's understanding
    console.log("File Details for Mr.Hamit:\n", req.file);
    console.log("Files Uploaded!!!!\n")
    console.log("Data of Form Submitted", req.body)

    if (req.file) {
        //cloudinary.v2.uploader.upload(file, options).then(callback);
        const results = await cloudinary.uploader.upload(req.file.path)


    }

    musicService.addAlbum(req.body).then(() => {
        res.redirect("/albums")
    }).catch((err) => {
        res.send({ message: err })
    })

})


// SETTING UP A ROUTE TO LISTEN ON "/genres"
app.get('/genres', (req, res) => {
    musicService.getAllGenres().then((data) => {
        if (data.length > 0) {
            res.render('genres', {
                genres: data
            })
        }
        else {
            res.render('genres', {
                message: "SORRY, NO RESULTS FOUND!!😔😔😔"
            })
        }

    }).catch((err) => {
        res.render("genres", {
            message: "SORRY, NO RESULTS FOUND!!😔😔😔"
        });
    })
})

// SETTING UP A ROUTE TO LISTEN ON "/genres/add"

app.get('/genres/add', (req, res) => {
    res.render("addGenres",
        {
            data: null,
            layout: 'main'
        });
})

app.post('/genres/add', (req, res) => {
    musicService.addGenre(req.body).then(() => {
        res.redirect('/genres')
    }).catch((err) => {
        res.send({ message: err })
    })
})
// SETTING UP A 404 PAGE
app.use((req, res) => {
    // res.status(404).send("Page not Found!!")
    res.render("404", {
        data: null
    })
})


// SETTING UP THE SERVER TO LISTEN ON PORT(8080)
musicService.initialize().then(() => {
    app.listen(HTTP_PORT, OnHttpStart)
}).catch((err) => {
    res.json({ "msg": err })
})
