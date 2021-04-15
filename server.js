const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser');

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var connect = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:""
});

connect.connect(function(err){
    if(err) console.log(err)
    else console.log("mysql connection successfull")
});


//method on server connection 
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    require('./src/api/') (app, connect)
    console.log("Example app listening at http://%s:%s", host, port)
 })

 

 module.exports.app = app

