'use strict'
const express = require('express');
const server = express();
const data = require('./MovieData/data.json');
const cors = require('cors');
const axios = require('axios');
server.use(cors());
require('dotenv').config();
const apiKey = process.env.api_key;

const PORT = 3000;
server.listen(PORT, () => {
 console.log(`running on port ${PORT}`)
});
function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview
}
function MovieApi(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview
}

let firstMovie = new Movie(data.title, data.poster_path, data.overview);
server.get('/', (req, res) => {
    res.send(JSON.stringify(firstMovie));
});
server.get('/favorite', (req, res) => {
    res.send("Welcome to Favorite Page");
});



let obj2 = {
    status: 500,
    resonseText: "Sorry, something went wrong"
};

server.get('/trending', TrendyMoviesEveryWeek);
server.get('/search', SearchForMoviesReleaseIn2000);
server.get('/ReleasDate', SearchReleasDate);
server.get('/SimilarMovies', SimilarMovies);

server.get('/servererror', (req, res) => {
    res.status(500).send("Page Not Found");
});
server.get('*', (req, res) => {
    res.status(404).send(JSON.stringify(obj2));
});
server.use(errorHandler)

function TrendyMoviesEveryWeek(req, res) {
    try{

    let url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
    axios.get(url)
        .then(result => {
           
            let MovieApiList = result.data.results.map(item => {
                let movie = new MovieApi(item.id, item.title, item.release_date, item.poster_path, item.overview)
                return movie;
            })
            res.send(MovieApiList);
        })
        .catch((error) => {
            res.status(500).send(error);
        })
    }
        catch(error){
            errorHandler(error,req,res);
        }
}
function SearchForMoviesReleaseIn2000(req, res) {
   try{
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=2&page=1&include_adult=false&primary_release_year=2000`;
    axios.get(url)
        .then(result => {
            
            let MovieApiListIn2000 = result.data.results.map(item => {
                let movie = new MovieApi(item.id, item.title, item.release_date, item.poster_path, item.overview)
                return movie;
            })
            res.send(MovieApiListIn2000);
        })
        .catch((error) => {
            res.status(500).send(error);
        })
    }
    catch(error){
        errorHandler(error,req,res);
    }
}

//relase date for given movie id=10468
function SearchReleasDate(req, res) {
try{
    let url = `https://api.themoviedb.org/3/movie/10468/release_dates?api_key=${apiKey}`;
    axios.get(url)
        .then(result => {
            
            let Movie= result.data.results;
        
        
            res.send(Movie);
        })
        .catch((error) => {
            res.status(500).send(error);
        })
    }
    catch(error){
        errorHandler(error,req,res);
    }
}

//Git similer Movie id=10468
function SimilarMovies(req, res) {
try{
    let url = `https://api.themoviedb.org/3/movie/10468/similar?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url)
        .then(result => {
            
            let MovieApiListIn2000 = result.data.results.map(item => {
                let movie = new MovieApi(item.id, item.title, item.release_date, item.poster_path, item.overview)
                return movie;
            })
            res.send(MovieApiListIn2000);
        })
        .catch((error) => {
            res.status(500).send(error);
        })
    }
    catch(error){
        errorHandler(error,req,res);
    }
}
 

function errorHandler(error,req,res){
    const err={
        errNum:500,
        msg:error
    }
    res.status(500).send(err);
}