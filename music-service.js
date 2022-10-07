// const fs = require("fs")

// // global variables
// var albums = [];
// var genres = [];

const Sequelize = require('sequelize')

var sequelize = new Sequelize('d3adkl47qantkc', 'bdvyosqesfulia', '12b34366538bc22e4fc755e368da5cc2d88e65c0873b0f233f6265dbf2b051eb', {
    host: 'ec2-3-219-19-205.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
})


// CREATING DATA MODELS

var Album=sequelize.define('Album',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    artist:Sequelize.STRING,
    Title:Sequelize.STRING,
    Label:Sequelize.STRING,
    AlbumCover:Sequelize.STRING,
    Released:Sequelize.DATE,
    Singles:Sequelize.STRING,
    Genre:Sequelize.STRING
    
})

var Genre=sequelize.define('Genre',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    genre:Sequelize.STRING
})


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
        if (albums.length) {
            //console.log(albums);
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
        var genreName;
        for (let i = 0; i < genres.length; i++) {
            if (genre == genres[i].id) {
                genreName = genres[i].genre
            }
        }
        for (let i = 0; i < albums.length; i++) {
            let result = genreName.localeCompare(albums[i].Genre);
            if (result == 0) {
                albumsToBeReturned.push(albums[i])
            }
        }
        if (albumsToBeReturned.length != 0) {

            resolve(albumsToBeReturned)
        }
        else {
            // console.log("NO DATA FOUND!!")
            reject("NO DATA FOUND!!")
        }
    })
}

// GET ALBUMS BY ID
module.exports.getAlbumsById = (id) => {
    let albumToBeReturned = {};
    let albumsReturned = [];
    return new Promise((resolve, reject) => {
        for (let i = 0; i < albums.length; i++) {
            if (id == albums[i].id)
                albumsReturned.push(albums[i]);
        }

        if (albumsReturned.length != 0) {
            //console.log(albumToBeReturned)
            albumToBeReturned = albumsReturned[0];
            resolve(albumToBeReturned)
        }
        else {
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
            //console.log(albums);
            resolve(newAlbum)
        }
        else {
            reject("No Data Found!!")
        }
    })
}