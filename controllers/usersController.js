const jwt =  require('jsonwebtoken')
const dotenv = require('dotenv')
const {createUser,existUser, existeUserPass,getListaFromUserPass,
    getPricesFromLista,getOrderByUser,
    StoreOrders,deleteStoreByUser,deleteUser,orderCountByUser,
    contactSet,contactGet,StoreSalesFromOrders} = require('../services/serviceUsers')

dotenv.config()
const secretKey = process.env.SECRET_KEY_JWT


// orders (tabla de pedidos)
const howManyStore = async (req,res)=>{
    const {user} = req.body
    try {
        //tieneStoreThisUser(user)    
        const result = await orderCountByUser(user) 
        console.log(result)
        if (result)
         if (result > 0)
            {res.status(200).json({ok:true, status:200, store:result, message: 'Store al most one recovered '})}
             else 
            {res.status(200).json({ok:true, status:200, store:result, message: 'Doesn´t has Store saved'})}

        else 
            {res.status(404).json({ok:false, status:404, message: 'There does´n have any store to delete'})}
    } 
    catch (error) {
        console.log(error)
    }
}
const delStore = async (req,res)=>{
    const {user} = req.body
    try {
        //tieneStoreThisUser(user)    
        const result = await deleteStoreByUser(user) 
        console.log(result)
        if (result) {res.status(200).json({ok:true, status:200, message: 'Store order was deleted '})}
        else {res.status(404).json({ok:false, status:404, message: 'There does´n have any store to delete'})}
    } 
    catch (error) {
        console.log(error)
        //res.status(404).json({ok:false, status:404, message: 'can´t delete store for this user: '+user})
    }
}

const setStoredByUser = async (req,res)=>{
 const {user,cart} = req.body
 if (!user) { res.status(404).json({ok: false, status:404, message: 'User doesn´t found'}) }
 if (!cart) { res.status(404).json({ok: false, status:404, message: 'Cart is empty'}) }
    try {
        const previous = await getOrderByUser(user)
        if (previous){
             const task = await deleteStoreByUser(user)
             if (!task){res.status(404).json({ok: false, status:404, message: 'Can´t erase previuos stored !!'})}
        }
        const result = await StoreOrders(user,cart)
        console.log(result,user,cart)
        if (result){res.status(200).json({ok: true, status:200, message: 'Order was  stored !!'})}
            else {res.status(404).json({ok: true, status:404, message: 'User order doesn´t found !!'})

            } 
    } catch (error) {
        res.status(500).json({ok:false, status:500, message: 'error when try to store order'})
    }
}

const getStoreByUser = async(req,res)=>{
    const {user}=req.body
     try {
        if (!user) {res.status(404).json({ok:false, status:404,  message: 'User is null'})}
        const result = await getOrderByUser(user)
        console.log(result)
        if (result){res.status(200).json({ok: true, status:200, lastOrder: result, message: 'Last order recovered !!'})}
            else {res.status(404).json({ok: true, status:404,  message: 'Last order not found !!'})}
          
            //deleteStoreByUser(user) /* */
        
     } catch (error) {
        console.log(error)
        res.status(500).json({ok:false, status:500, message: 'error trying to get last order '})
     }

}

const getOrderToSales = async (req,res)=>{
    const {user,cart,email} = req.body
    if (!user) { res.status(404).json({ok: false, status:404, message: 'User can´t be empty'}) }
    if (!cart) { res.status(404).json({ok: false, status:404, message: 'Cart can´t be empty'}) }
    if (!email) { res.status(404).json({ok: false, status:404, message: 'email can´t be empty'}) }
       try {
           const previous = await StoreSalesFromOrders(user,cart,email)
          if (previous && typeof(previous=='number')){res.status(200).json({ok: true, status:200, lastId:previous ,message: 'Sales saved'})} 
        else {res.status(404).json({ok: false, status:404, message: 'Can´t save this Cart'})}
       } catch (error) {
        console.log(error)
       }
   }

   

// usuarios

const deluser = async (req,res)=>{
    const resultUser = await deleteUser(user) 
    if (resultUser) {
        res.status(200).json({ok:true, status:200, message: 'user: '+user+' was deleted '})
    }else{
        res.status(500).json({ok:false, status:500, message: 'error when try to delete a user: '+user})
    }
}
const addUser = async (req,res)=>{
   const {address, user, firstName, lastName, password, email, fechaNacimiento} =req.body
   if (!address) {return res.status(404).json({ok:false, message: "Address can´t be null"})} else if 
   (!user) {return res.status(404).json({ok:false, message: "User can´t be null"})} else if
    (!firstName) {return res.status(404).json({ok:false, message: "Firstname can´t be null"})} else if 
   (!lastName) {return res.status(404).json({ok:false, message: "Lastname can´t be null"})} else if 
   (!password) {return res.status(404).json({ok:false, message: "Password can´t be null"})} else if 
   (!email) {return res.status(404).json({ok:false, message: "Email can´t be null"})} else if 
   (!fechaNacimiento) {return res.status(404).json({ok:false, message: "Date of born can´t be null"})} 

   const resultUser = await existUser(user)
   
   //let userExist = Object.values(resultUser.find(p=>p.exist==1))[0]
   if (resultUser) {
    res.status(200).json({ok: false, status:200,message: 'Must use another username '})
   } 
    else {
        const result = await createUser(address,user,firstName,lastName,password,email,fechaNacimiento)
        
        if(!result){
            res.status(500).json({ok:false, status:500, message: 'error when try to creat a new user'})
        }
        else{
            const token = jwt.sign({user,lista:'Lista3'}, secretKey, {expiresIn: '24h'})
            const prices = await getPricesFromLista('Lista3')
            res.status(200).json({  ok: true,
                                    status:200,
                                    prices:prices,
                                    accessToken: token , 
                                    message: 'User was add succefully !!'})
        }
    }
}

const addContact = async (req,res)=>{
    const{user,msg,name,email} =req.body  
    if (!user) { res.status(404).json({ok: false, status:404, message: 'User can´t be empty'}) }
    if (!msg) { res.status(404).json({ok: false, status:404, message: 'Message can´t be empty'}) }

    const result = await contactSet(user,msg,name,email)
    if (result.affectedRows===1) {
        res.status(200).json({ok: true, status:200,message: 'Thank you for your comment'})
       } 
        else {
             res.status(500).json({ok: false,res:result, status:500,message: 'Can\'t insert this comment '})
        }
     }

     const listContact = async (req,res)=>{
        const{user} =req.body  
        if (!user) { res.status(404).json({ok: false, status:404, message: 'User can´t be empty'}) }
        const result = await contactGet(user)
        console.log(result)
        if (result) {
            res.status(200).json({ok: true, status:200,messages:result, message: 'Thank you for your comment'})
           } 
            else {
                 res.status(200).json({ok: false, messages:result})
            }
         }
    
     const getContact = async (req,res)=>{
        const{user} =req.body
   
        const result = await contactGet(user)
        console.log(result)

     }

const existThisUser = async (req, res)=>{
    const {user} = req.body
    if (!user) {return res.status(404).json({ok:false, message: "User can t be null"})} else{
        const result = await existUser(user)
    if (result==true) {
        res.status(200).json({ok: true,status:200, message: 'User exist !!'})
       }else{
        res.status(404).json({ok: false,status:404, message: 'User don´t exist !!'})
    }
    }
}

const accessUser = async (req, res)=>{
    const {user,password} = req.body
    const lista =await  getListaFromUserPass(user,password)
    const pedidoGuardado = await getOrderByUser(user)
    if (lista) {
        const token = jwt.sign({user,lista}, secretKey, {expiresIn: '24h'})
        const prices = await getPricesFromLista(lista)
        res.status(200).json({ok: true,status:200,prices:prices,accessToken: token ,stored: pedidoGuardado, message: 'User login success !!'})
      }else{
         res.status(401).json({ok: false, status:401,message: 'User or  Password incorrect '})
      }
}

const getLista = async (req, res)=>{
    const headerValue = req.headers['authorization'];
    if (!headerValue){return res.status(401).json({ok:false,message:"Unauthorized user"})}
    const lista = JSON.parse(atob(headerValue.split(".")[1])).lista
    //console.log(lista)
    const prices =await  getPricesFromLista(lista)
    if (!prices) {
        res.status(401).json({ok: false, status:401,message: 'Incorrect  List '})
      }else{
        res.status(200).json({ok: true,status:200,prices:prices,message: 'prices from: '+lista}) 
      }
}

const registeredUser = async (req, res)=>{
    
    const {myUser,mypass} = req.body
    if (!myUser) {return res.status(404).json({ok:false, message: "User can t be null"})} 
        else if (!mypass){return res.status(404).json({ok:false, message: "Password can t be null"})}
    else{
        const result = await existeUserPass(myUser,mypass)
        if (result==true) {
            res.status(200).json({ok: true, status:200,message: 'User registered !!'})
        }else{
            res.status(404).json({ok: false, status:404,message: 'User isn\'t registered !!'})
        }
    }
}





module.exports = {addUser,existThisUser,registeredUser,accessUser,getLista,
    getStoreByUser,setStoredByUser,delStore,howManyStore,getOrderToSales,deluser,addContact,getContact,listContact}