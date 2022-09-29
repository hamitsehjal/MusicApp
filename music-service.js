const fs = require("fs")

// global variables
var albums = [];
var genres = [];


// INITIALIZE FUNCTION
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/albums.json', 'utf-8', (err, data) => {
            if (err)
                reject("unable to read file");

            // parsing the data and storing it in albums array
            albums = JSON.parse(data)
            //console.log(data)

            fs.readFile('./data/genres.json', 'utf-8', (err, data) => {
                if (err)
                    reject("unable to read file");

                // parsing the data and storing it in genres array
                genres = JSON.parse(data)
                console.log(data)

                resolve("SUCCESS - DATA PARSED SUCCESFULLY !!!")
            })
        })
    })
}

// GET ALL ALBUMS FUNCTION
module.exports.getAllAlbums = () => {
    return new Promise((resolve, reject) => {
        if (albums.length)
        {
            console.log(albums);
            resolve(albums)

        }
        else
            reject("NO DATA FOUND!!")

    })
}

// GET ALBUMS BY GENRES
module.exports.getAlbumsByGenre = (genre) => {
    var albumsToBeReturned = [];
    //console.log(genre)
    return new Promise((resolve, reject) => {
        for (let i = 0; i < albums.length; i++) {
            let result = genre.localeCompare(albums[i].Genre);
            if (result==0) {
                albumsToBeReturned.push(albums[i])
            }
        }
        if (albumsToBeReturned.length!=0) {
            
            resolve(albumsToBeReturned)
        }
        else {
            // console.log("NO DATA FOUND!!")
            reject("NO DATA FOUND!!")
        }
    })
}
// GET ALL GENRES FUNCTION
module.exports.getAllGenres = () => {
    return new Promise((resolve, reject) => {
        if (genres.length)
            resolve(genres)
        else
            reject("NO DATA FOUND!!")
    })
}

// addAlbum function
module.exports.addAlbum = (newAlbum) => {
    return new Promise((resolve, reject) => {
        if (newAlbum) {
            newAlbum.id = albums.length + 1;
            albums.push(newAlbum)
            console.log(albums);
            resolve(newAlbum)
        }
        else {
            reject("No Data Found!!")
        }
    })
}