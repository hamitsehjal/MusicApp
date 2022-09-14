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

// Since, we are using remote storage(cloudinary) to store album covers, we
// will create empty upload variable without any disk storage since we are not using disk storage
//
const upload = multer()  // --**IMPORTANT


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

app.post('/albums/add', upload.single('AlbumCover'), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded) => {
            processPost(uploaded.url);
        });
    } else {
        processAlbum("");
    }

    function processAlbum(imageUrl) {
        req.body.AlbumCover = imageUrl;

        //Process the req.body and add it as a new album before redirecting to /albums
        musicService.addAlbum(req.body).then(() => {
            res.redirect("/albums")
        }).catch((err) => {
            res.send({ message: err })
        })

    }

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
