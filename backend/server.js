var express = require("express")
var app = express()

const {MongoClient} = require("mongodb")
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri)

app.get("/", (req,res)=>{
    res.send("Welcome to RunIO")
})

async function run(){
    try{
        await client.connect()
        console.log('Successfully Connected to MongoDB')
        var server = app.listen(8081, (req, res) => {
            var host = server.address().address
            var port = server.address().port
            console.log("RunIO Server Running on: http://%s:%s", host, port)
        })
    }
    catch(err){
        console.log(err)
        await client.close()
    }
}

run()