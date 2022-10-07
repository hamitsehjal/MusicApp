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

var Album = sequelize.define('Album', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    artist: Sequelize.STRING,
    Title: Sequelize.STRING,
    Label: Sequelize.STRING,
    AlbumCover: Sequelize.STRING,
    Released: Sequelize.DATE,
    Singles: Sequelize.STRING,

})

var Genre = sequelize.define('Genre', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    genre: Sequelize.STRING
})

// Defining relationship between Album and Genre
// This will ensure that our "Album" model has a "genre" column that will act as a foreign key to the Genre model

Album.belongsTo(Genre, { foreignKey: 'genre' })

// INITIALIZE FUNCTION
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve('CONNECTION SUCCESSFULL!!')
        }).catch((err) => {
            reject("CONNECTION UN-SUCCESSFULL!!")
        })
    })
}

// GET ALL ALBUMS FUNCTION
module.exports.getAllAlbums = () => {
    return new Promise((resolve, reject) => {
        // RETURN ALL ALBUMS
        Album.findAll().then((data) => {
            resolve(data)
        }).catch((err) => {
            reject("NO DATA FOUND!!")
        })

    })
}

// GET ALBUMS BY GENRES
module.exports.getAlbumsByGenre = (genre_value) => {

    return new Promise((resolve, reject) => {
        Album.findAll({
            where: {
                genre: genre_value
            }
        }).then((data) => {
            resolve(data)
        }).catch((err) => {
            reject("NO DATA FOUND!!")
        })
    })
    // var albumsToBeReturned = [];
    // //console.log(genre)
    // return new Promise((resolve, reject) => {
    //     var genreName;
    //     for (let i = 0; i < genres.length; i++) {
    //         if (genre == genres[i].id) {
    //             genreName = genres[i].genre
    //         }
    //     }
    //     for (let i = 0; i < albums.length; i++) {
    //         let result = genreName.localeCompare(albums[i].Genre);
    //         if (result == 0) {
    //             albumsToBeReturned.push(albums[i])
    //         }
    //     }
    //     if (albumsToBeReturned.length != 0) {

    //         resolve(albumsToBeReturned)
    //     }
    //     else {
    //         // console.log("NO DATA FOUND!!")
    //         reject("NO DATA FOUND!!")
    //     }
    // })
}

// GET ALBUMS BY ID
module.exports.getAlbumsById = (id_value) => {
    return new Promise((resolve, reject) => {
        Album.findAll(
            {
                where: {
                    id: id_value

                }
            }
        ).then((data) => {
            resolve(data)
        }).catch((err) => {
            reject("NO DATA FOUND!!")
        })
    })
    // let albumToBeReturned = {};
    // let albumsReturned = [];
    // return new Promise((resolve, reject) => {
    //     for (let i = 0; i < albums.length; i++) {
    //         if (id == albums[i].id)
    //             albumsReturned.push(albums[i]);
    //     }

    //     if (albumsReturned.length != 0) {
    //         //console.log(albumToBeReturned)
    //         albumToBeReturned = albumsReturned[0];
    //         resolve(albumToBeReturned)
    //     }
    //     else {
    //         reject("NO DATA FOUND!!")
    //     }
    // })

}
// GET ALL GENRES FUNCTION
module.exports.getAllGenres = () => {
    return new Promise((resolve, reject) => {
        Genre.findAll().then((data) => {
            resolve(data)
        }).catch((err) => {
            reject("NO DATA FOUND!!")
        })
        // if (genres.length)
        //     resolve(genres)
        // else
        //     reject("NO DATA FOUND!!")
    })
}

// addAlbum function
module.exports.addAlbum = (newAlbum) => {
    return new Promise((resolve, reject) => {
        Album.create(newAlbum).then((data) => {
            resolve(data)
        }).catch((err) => {
            reject("UNABLE TO CREATE ALBUM")
        })
        //     if (newAlbum) {
        //         newAlbum.id = albums.length + 1;
        //         albums.push(newAlbum)
        //         //console.log(albums);
        //         resolve(newAlbum)
        //     }
        //     else {
        //         reject("No Data Found!!")
        //     }
    })
}

// delete Album by id function
module.exports.deleteAlbumById = (id_value) => {
    return new Promise((resolve, reject) => {
        Album.destroy({
            where: {
                id: id_value
            }
        })
    })
}

// addGenre Function
module.exports.addGenre = (newGenre) => {
    return new Promise((resolve, reject) => {
        Genre.create(newGenre).then((data) => {
            resolve(data)
        }).catch((err) => {
            reject("UNABLE TO CREATE Genre")
        })
    })
}

// delete Genre by id function
module.exports.deleteGenreById = (id_value) => {
    return new Promise((resolve, reject) => {
        Genre.destroy({
            where: {
                id: id_value
            }
        })
    })
}