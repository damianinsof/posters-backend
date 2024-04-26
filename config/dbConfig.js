const mysql = require('mysql2')
const fs = require('fs')
//const util = require('util')
/*
console.log({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MYSQL_DATABASE,
    port: process.env.DB_PORT
})*/
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_MYSQL_DATABASE,
    port: process.env.DB_PORT
})
// Listener
pool.on('error',(error)=>{
    console.error('Error en pool ',error)
})

pool.getConnection((err,connection)=>{
    if (err){
        console.error("Error en pool",err)
    } else{
        //console.log(connection)
        console.log("Conexión Ok")
    }


})
/*
let counter = Number(fs.readFileSync('./static/dbErrorsCounter.txt', 'utf-8'))

db.connect((error) =>{
    if(error){
        fs.promises.writeFile('./logs/errors/db/error-' + counter++ + '.txt', JSON.stringify(error), 'utf-8')
        fs.promises.writeFile('./static/dbErrorsCounter.txt', String(counter), 'utf-8')
        console.error('Error al conectar a MySql')
       
    }
    else{
        console.log('Conectado con exito a la Base de datos')
    }
})


const dbQueryAsync = util.promisify(db.query).bind(db) // ahora queryAsync nos permite interactuar con mysql de manera asincrona
*/

//onst usePool = (query) = pool.promise().query(query)

module.exports = {pool}