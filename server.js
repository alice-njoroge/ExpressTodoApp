const  express = require('express');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT;

const db = mysql.createConnection({
    host : 'localhost',
    user: 'root',
    password: 'password',
    database: 'ExpressTodo'
});
db.connect((err)=>{
    if (err){
        throw err;
    }
    console.log("connected!")
})
global.db=db;

app.get('/', (req,res)=> {
   return res.json({message: "hello world"})
});
app.listen(port || 3030, ()=> {
    console.log(`the app is running on port ${port}`)
});