'use strict'
const express = require('express');
const server = express();
const data = require('./MovieData/data.json');
const cors = require('cors');
const axios = require('axios');
server.use(cors());
require('dotenv').config();
const apiKey = process.env.api_key;

const pg=require('pg');
const client=new pg.Client('postgresql://localhost:5432/lab15db');
const PORT = 3003;
server.use(express.json());
client.connect()
.then(()=>{
    server.listen(PORT, () => {
        console.log(`running on port ${PORT},Im ready..`)
       });
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
server.post('/addMovie', addMovie);
server.get('/getMovies', getMovies);
server.put('/updatemovie/:id', updatmovie);
server.delete('/deletemovie/:id', deletemovie);
server.get('/getmovie/:id', getmoviebyid);
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
 
function addMovie(req,res){
  const movie=req.body;
  const sql=`INSERT INTO movies (title, release_date, overview)
  VALUES ($1, $2, $3);`
  const values=[movie.title,movie.release_date,movie.overview];
  client.query(sql,values)
  .then(data=>{
    res.send('data has been added');
  })
  .catch(error=>{
    errorHandler(error,req,res);
  })
}
function getMovies (req,res){

    const sql=`SELECT * FROM movies;`
    client.query(sql)
    .then(data=>{
        res.send(data);
      })
      .catch(error=>{
        errorHandler(error,req,res);
      })
}
function updatmovie(req,res){
    const {id}=req.params;
    const info=req.body;
    const sql=`UPDATE movies
    SET title = $1, release_date = $2, overview=$3
    WHERE id=${id};`
    const values=[info.title,info.release_date,info.overview];
    client.query(sql,values)
    .then(data=>{
        res.status(200).send("updated successfully");
    })
    .catch(error=>{
        errorHandler(error,req,res)
    })
}
function deletemovie(req,res){
    const {id}=req.params;
   
    const sql=`DELETE FROM movies WHERE id=${id};`

    client.query(sql)
    .then(data=>{
        res.status(200).send("Deleted successfully");
    })
    .catch(error=>{
        errorHandler(error,req,res)
    })
}
function getmoviebyid(req,res){
    const {id}=req.params;
    
    const sql=`SELECT * FROM movies WHERE id=${id};`
    
    client.query(sql)
    .then(data=>{
        res.status(200).send(data.rows);
    })
    .catch(error=>{
        errorHandler(error,req,res)
    })
}
function errorHandler(error,req,res){
    const err={
        errNum:500,
        msg:error
    }
    res.status(500).send(err);
}