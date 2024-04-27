
const express = require('express')
const dotenv = require('dotenv')
const jwt =  require('jsonwebtoken')
const cors = require('cors')


dotenv.config()

const usersRouter = require('./router/usersRouter')
const { existeUserPass } = require('./services/serviceUsers')


const app = express()
const PORT = process.env.PORT || 8081




/* Middlewere de cofiguracion de los archivos estaticos */
app.use(cors())
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const secretKey = process.env.SECRET_KEY_JWT

app.use('/api/user',usersRouter)



//Configurar el Motor de plantillas



/*

usersRouter.post('/register', async (req, res) =>{
    console.log(req.body)
    const {address,user,firstName,lastName,password,email,fechaNacimiento} = req.body
    console.log(address,user,firstName,lastName,password,email,fechaNacimiento)
    const result = await existUser(user)
    console.log(result)
    res.status(400).json({message: result, status: 400})

    if(users.find((user) => users.user === user)){
        return res.status(400).json({message: 'Username is not available', status: 400})
    }
    if (user) {
        const newUser = { address,user,firstName,lastName,password,email,fechaNacimiento}
        users.push(newUser)
        res.status(201).json({message: 'User was created successfully!', status: 201})
    }else{
        res.status(400).json({message: 'User Undefined', status: 400})
    }
    
    console.log(users)
})*/


usersRouter.post('/login', async (req, res) =>{
    const {user, password} = req.body
     console.log(user,password) 
    const myuser = await existeUserPass(user,password)
    if(myuser){
        const token = jwt.sign({user}, secretKey, {expiresIn: '1h'})
        res.status(200).json({accessToken: token, status: 200})
 
    } else{
        return res.status(401).json({message: 'Invalid credentials', status: 401})   
    }
    

})


/* 
Crear el endpoint /home donde pasemos un nombre al home.hbs
para poder mostrar en la pagina un h1 que diga 'Hola ' + nombre
A
*/

usersRouter.get('/',(req,res)=>{
    res.send('Backend Ok')
})

app.listen(PORT, () =>{
    console.log('el servidor se escucha en http://localhost:' + PORT +'/')
})

