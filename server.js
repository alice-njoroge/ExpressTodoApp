const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const port = process.env.PORT;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ExpressTodo'
});
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log("connected!")
});
global.db = db;

const createTables = "CREATE TABLE IF NOT EXISTS `todos` (\n" +
    "  `id` int(5) NOT NULL AUTO_INCREMENT,\n" +
    "`name` varchar(255) NOT NULL, \n" +
    "`completed` tinyint default 0, \n" +
    "  PRIMARY KEY (`id`)\n" +
    ") ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;";
db.query(createTables, (err, result) => {
    if (err) {
        throw err;
    }
    console.log("tables created");
});

app.get('/', (req, res) => {
    const query = "select * from todos order by id desc; ";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({message: "Server Error", error: err})
        }
        return res.json({data: result})
    });

});

// create a new list item in your todo_app
app.post('/create', (req,res)=>{
    const name = req.body.name;
    const  query = "insert into todos (name) values ('"+ name +"')";
    db.query(query, (err,result)=>{
        if (err){
            return res.status(500).json({message: "failed", error: err});
        }
        return res.status(201).json({message: "Task created successfully"})
    })
});

/**
 * get a single task 
 */
app.get('/:id', (req, res)=>{
   const task_id = req.params.id;
   const query = `select * from todos where id = ${task_id}`;
       db.query(query, (err, result)=>{
           if (err){
               return res.status(500).json({message:"failed", error:err});
           }
           return  res.json({result:result[0]});
       } )
});

app.put('/:id', (req,res)=>{
   const task_id = req.params.id;
   const name = req.body.name;
   const completed = req.body.completed;
   let query= `update todos set  name = '${name}', completed = ${completed} where id = ${task_id}`;
   db.query(query, (err, result)=>{
      if (err){
          return res.status(500).json({message: "failed to update", error:err});
      }
      return res.json({message: " successful!"});
   });
});

app.delete('/:id', (req, res)=>{
   const task_id = req.params.id;
   const query = `delete from todos where id = ${task_id}`;
   db.query(query, (err, result)=>{
       if(err){
           return res.status(500).json({message: "unable to delete", error:err})
       }
       return res.json({message: "deleted successfully"});
   })
});

app.listen(port || 3030, () => {
    console.log(`the app is running on port ${port}`)
});