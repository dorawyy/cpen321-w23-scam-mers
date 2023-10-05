var express = require("express")
var app = express()

app.get("/", (req,res)=>{
    res.send("Welcome to RunIO")
})

var server = app.listen(8081, (req, res) => {
    var host = server.address().address
    var port = server.address().port
    console.log("RunIO Server Running on: http://%s:%s", host, port)
})