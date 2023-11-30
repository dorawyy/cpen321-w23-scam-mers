import express from "express";
var router = express.Router()

// ChatGPT usage: PARTIAL
router.get("/", (req, res)=>{
    res.send("Welcome to RunIO")
})

export {router as landingRoutes};