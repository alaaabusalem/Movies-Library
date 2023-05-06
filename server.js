const express=require ('express');
const server=express();
const data=require('./MovieData/data.json');
const PORT=3000;
server.listen(PORT,()=>{

});
function Movie(title,poster_path,overview){
this.title=title;
this.poster_path=poster_path;
this.overview=overview
}

let firstMovie=new Movie(data.title,data.poster_path,data.overview);
server.get('/',(req,resp)=>{
resp.send(JSON.stringify(firstMovie));
});
server.get('/favorite',(req,resp)=>{
    resp.send("Welcome to Favorite Page");
    });

    server.get('/servererror',(req,resp)=>{
        resp.status(500).send("Sory,SERVER ERROR");
        });

    let obj2={status: 404,
        responseText: "page not found error"};
    server.get('*',(req,resp)=>{
        resp.status(404).send(JSON.stringify(obj2));
        });
        