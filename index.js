const express = require("express");
const app = express()
const axios = require("axios");
const cors = require("cors");
require('dotenv').config()
app.use(cors());
const pg=require("pg");
PORT=process.env.PORT;


app.use(express.json()); 

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

app.get("/", homeHandler);
app.post("/addToFav",addToFavHandler);
app.get("/getDrinks",getAllDrinks);
app.delete("/delete/:id",deleteDrinkHandler);
app.put("/update/:id",updateDrinkHandler);




async function addToFavHandler(req,res){
    const {strDrink,strDrinkThumb,comment}=req.body;

    try{
        let sql = 'INSERT INTO drinks (strDrink, strDrinkThumb, comment) VALUES ($1, $2, $3)';
        let safeValues = [strDrink, strDrinkThumb, comment];
        let result = await client.query(sql, safeValues);
        res.send(result);
    }catch(error){
       console.log(error)
    }
}


async function homeHandler(req,res) {
    try {
        let theData = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic");
        console.log(theData.data.drinks)
        res.send(theData.data.drinks);
    } catch (error) {
        console.log(error)

    }
}


async function getAllDrinks(req,res){
    let sql = 'SELECT * FROM drinks';
    let result = await client.query(sql);
    console.log("getting data")
    res.send(result.rows);
}




async function deleteDrinkHandler(req,res){
    let id=req.params.id;
    try{
        let sql=`DELETE FROM drinks WHERE id=${id}`;
        await client.query(sql);
    
        let sqlAll = 'SELECT * FROM drinks';
        let resultAll = await client.query(sqlAll);
        res.send(resultAll.rows);

    }catch(error){
        console.log(error);
    }
}


async function updateDrinkHandler(req,res){
    let id=req.params.id;
    try{
        let newComment=req.body.comment;
        let sql = `UPDATE drinks SET comment = '${newComment}'WHERE id=${id}`;
        let result = await client.query(sql);

        let sqlAll = 'SELECT * FROM drinks';
        let resultAll = await client.query(sqlAll);
        res.send(resultAll.rows);
    }catch(error){
        console.log(error);
    }
}


//handle the 404 errors 
app.use((req,res)=>{
    res.status(404).send({
        error:"something went wrong 404 Status !!!"
    });
})

//handle the 500 errors 
app.use((err,req,res,next)=>{
    res.status(500).send({
        error:"something went wrong 500 Status !!!"
    });
    
})




client.connect()
    .then(() => {
        app.listen(PORT, () =>
            console.log(`listening on ${PORT}`)
        );
    })