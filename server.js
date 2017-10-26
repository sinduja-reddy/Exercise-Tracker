const express = require('express')
const app = express();

const bodyParser = require('body-parser');
const shortid = require('shortid');


var UserEntry=require('./app/userEntry');
var UserExerciseEntry =require('./app/addEntry');

var userUtlits= require('./app/user-utlits');
var add =require('./app/add-utlits');

const cors = require('cors')

const mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI );
mongoose.Promise = global.Promise;


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
//user schema


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

 app.post('/api/exercise/new-user',(req,res)=>{
     let user= req.body.username;
    userUtlits.isDuplicateUser(user).then((exist)=>{
     if(exist){
       res.send('username already exists');
     }
     else{
       userUtlits.insertUser(user).then((doc)=>{
     if(!doc){
       res.send('unknown err');
     }else{
          res.json({username:user,id:doc.userid});
     }
  });
     }
   })
   
});


app.post('/api/exercise/add',(req,res)=>{
  let exer=req.body;
  
  add.insertExercise(exer).then((doc)=>{
    if(!doc){
      res.send("userid doesn't exist");
    }else{
      let date=new Date(doc.date);
  let month=date.getMonth()+1;
      res.json({username:doc.username,userid:doc.userid, duration:doc.duration,description:doc.description,date:date.getDate()+'-'+month+'-'+date.getFullYear()});
    }
  })

});


app.get('/api/exercise/log',(req,res)=>{
  let userId= req.query.userId;
  let arr;
  let length;
  add.findOut(userId).then((doc)=>{ 
    length=doc.length;
    arr= doc.map((d)=>{
      let date=new Date(d.date);
      let month= date.getMonth()+1;
                return {
                  description:d.description,
                  duration: d.duration,
                  date:date.getDate()+'-'+month+'-'+date.getFullYear()
                }
                });
    res.json({userid:userId, count:length, log:arr});
  })
})



// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})