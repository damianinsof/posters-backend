
const {pool} = require('../config/dbConfig')



const existUser = async (user)=>{
    console.log(user)
    try{
        const sql = "SELECT CASE WHEN exists(select * from users where user= ? ) THEN true else false end as exist "
        const res = await pool.promise().query(sql,[user])
        console.log(res)
        if  (res[0][0].exist === 1) {return true}
        else {return false}
    }
    catch (e){
        return false
    }
}
const existeUserPass = async (user,password)=>{

    try{
        const sql = "SELECT CASE WHEN exists(select * from users where user = ? and password = ?) THEN true else false end as exist "
        const res = await pool.promise().query(sql,[user,password])
           if  (res[0][0].exist === 1) {return true}
        else {return false}
    }
    catch (e){
        return false
    }
}

 /*                                SERVICIOS INTERMEDIO ENTRE USUARIO Y PEDIDO    */
 const getListaFromUserPass = async (user,password)=>{

    try{
        const sql="SELECT lista FROM users WHERE user = ? and password=?"
        const res = await pool.promise().query(sql,[user,password])
        console.log(res[0][0].lista)
        return res[0][0].lista
    }
    catch (e){
        return null
    }
}
const getPricesFromLista = async (lista)=>{
    let sql='SELECT id, price3 price FROM prices'
    switch (lista){
        case 'Lista1':
            sql="SELECT id, price1 price FROM prices "
            break;
        case 'Lista2':
            sql="SELECT id, price2 price FROM prices "
            break;
    }
    try{
        const res = await pool.promise().query(sql)
        //console.log(res)
        return res[0]
    }
    catch (e){
        return null
    }
}




/*                               SERVICIOS DE USUARIO */ 
const createUser = async (address,user,firstName,lastName,password,email,fechaNacimiento)=>{
    try{
        const query = "INSERT into users (address,user,firstName,lastName,password,email,fechaNacimiento) values(?,?,?,?,?,?,?)" 
        const res = await pool.promise().query(query,[address,user,firstName,lastName,password,email,fechaNacimiento])
        console.log(res[0])
        return res[0]
    }
    catch (e){  
        return false
    }
    
}

const contactSet = async (user,msg,name,email)=>{
    try{
        const query = "INSERT into contact (user,name,email,msg) values(?,?,?,?)" 
        const res = await pool.promise().query(query,[user,name,email,msg])
        console.log(res[0])
        return res[0]
    }
    catch (e){  
        return e
    }
}

const contactGet = async (user)=>{
    try{
        const query = "Select user,name,email,msg,date from contact where user = ?" 
        const res = await pool.promise().query(query,[user])
        console.log(res[0])
        return res[0]
    }
    catch (e){  
        return e
    }
}


const deleteUser = async (user)=>{
    try{
        
        const query = "DELETE from users WHERE user = ?" 
        const res = await pool.promise().query(query,[user])
        return res[0]
        
    }
    catch (e){  
        return false
    }
}
/*                        SERVICIOS DE STORE DE USUARIO    */
const orderCountByUser = async (user)=>{
    try{
        console.log("ordercount",user)
        const query = "select count(*) cantidad from orders where user = ? ;"
        const res = await pool.promise().query(query,[user])
        console.log(res)
         return res[0][0].cantidad 
    }
    catch (e){  
        return 0
    }
}
const deleteStoreByUser = async (user)=>{
    try{
        const query = "DELETE from orders WHERE user = ?" 
        const res = await pool.promise().query(query,[user])
        console.log(res[0])
        return res[0]
    }
    catch (e){ 
        console.log(e) 
        return e
    }
}

const StoreOrders = async (user,cart)=>{ 
    try{
        if (!cart || !user){return false}

        const dellast = await deleteStoreByUser(user)
        console.log(dellast)
        const sql="insert into orders (user,cart) values ('"+user+"',?)"
        const res = await pool.promise().query(sql,[JSON.stringify(cart)])
        return res[0]
    }
    catch (e){  
        return false
    }
    
}

const StoreSalesFromOrders = async (user,cart,email)=>{
    console.log("service",user,cart,email)
    try{
        const sql="insert into Sales (user,cart,obs) values ('"+user+"',?,'"+email+"')"
        const res = await pool.promise().query(sql,[JSON.stringify(cart)])
        if(res){
            const sql2 = "SELECT LAST_INSERT_ID() lastId;"
            const res2 = await pool.promise().query(sql2)
            console.log(res2[0][0].lastId)
            return res2[0][0].lastId
        }
        return false 
    }
    catch (e){  
        return false
    }
    
}


const getOrderByUser = async (user)=>{
    try{
        if (!user){return null}
        const sql = "SELECT cart FROM `orders` WHERE user= ?"
        const res = await pool.promise().query(sql,[user])
        console.log( res[0][0].cart)
        if  (res!=false) {return res[0][0].cart}
        else {return false}
    }
    catch (e){
        return false
    }
}

//
module.exports = {createUser,existUser,existeUserPass,getListaFromUserPass,
    getPricesFromLista,getOrderByUser,StoreOrders,deleteStoreByUser,
    deleteUser,orderCountByUser,StoreSalesFromOrders,contactGet,contactSet}