const express = require("express")
const multer = require("multer")
const app = express()
const bcrypt = require("bcrypt")
const File = require("./models/File")
require("dotenv").config()
const mongoose = require("mongoose")

const upload = multer({dest:"uploads"})

mongoose.connect(process.env.DATABASE_URL)
.then(()=>console.log('connected to the mongodb'))
.catch(()=>console.log('could not connected to the mongodb'))

app.set("view engine","ejs")

app.get("/",(req,res)=>{
    res.render("index")
})

app.post('/upload',upload.single("file"),async (req,res)=>{
    const fileData={
        path: req.file.path,
        originalName:req.file.originalname,
    }
    if(req.body.password != null && req.body.password !=""  ){
        fileData.password = await bcrypt.hash(req.body.password,10)
    }
    const file = await File.create(fileData)
    res.render("index",{fileLink:`${req.headers.origin}/file/${file.id}`})
})

app.get("/file/:id",async (req,res)=>{
    const file = await File.findById(req.params.id)

    file.downloadCount++
     await file.save
     console.log(file.downloadCount)

     res.download(file.path,file.origiNalname)

})

app.listen(process.env.PORT)