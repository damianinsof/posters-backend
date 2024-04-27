const express = require('express')
const {addUser,existThisUser, accessUser,getLista,getStoreByUser,setStoredByUser,
    delStore, howManyStore,getOrderToSales,deluser,
    addContact,listContact} = require('../controllers/usersController')

const authMiddleware = require('../middlewares/authMiddleware')
const { deleteStoreByUser, deleteUser } = require('../services/serviceUsers')

//const authMiddleware = require('../middlewares/authMiddleware')

const usersRouter = express.Router()

usersRouter.get('/',(req,res)=>{
    res.send('Backend Ok')
})

usersRouter.post('/register', addUser)

usersRouter.post('/login',accessUser )

usersRouter.post('/getLista',getLista )

usersRouter.post('/getorder',authMiddleware, getStoreByUser) //getStoreByUser  storeSelectedbyUser

usersRouter.post('/setOrder',authMiddleware,setStoredByUser )

usersRouter.post('/exist',authMiddleware,existThisUser)

usersRouter.post('/deleteorder',authMiddleware,delStore )

usersRouter.post('/deleteUser',authMiddleware,deluser)

usersRouter.post('/countorder',authMiddleware,howManyStore )

usersRouter.post('/contactus',authMiddleware,addContact )

usersRouter.post('/contactList',authMiddleware,listContact )

usersRouter.post('/deleteUser',authMiddleware,deleteUser )

usersRouter.post('/orderToSales',authMiddleware,getOrderToSales )

//productRouter.post('/', postProductController )

//productRouter.delete('/:pid', deleteProductController)

//productRouter.get("/:pid", getProductByIdController)

module.exports = usersRouter