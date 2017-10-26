const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const shortid = require('shortid');


const cors = require('cors')
let num;
const mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI );
mongoose.Promise = global.Promise;


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var userSchema= mongoose.Schema({
  username: String,
  userid:{ type: String, index:true}
});
var UserEntry = mongoose.model('UserEntry', userSchema);

var userExerciseSchema= mongoose.Schema({
  username:String,
  userid: String,
  description: String,
  duration:Number,
  date: Date
});
var UserExerciseEntry = mongoose.model('UserExerciseEntry', userExerciseSchema);

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

 app.post('/api/exercise/new-user',(req,res)=>{
     let user= req.body.username;
    isDuplicateUser(user).then((exist)=>{
     if(exist){
       res.send('username already exists');
     }
     else{
       insertUser(user).then((doc)=>{
     if(!doc){
       res.send('unknown err');
     }else{
          res.json({username:user,id:doc.userid});
     }
  });
     }
   })
   
});
function insertUser(user){
  let newUser= new UserEntry({
      username:user,
      userid: shortid.generate()
    });
    return newUser.save()
}
function isDuplicateUser(user){
     return UserEntry.findOne({'username': user}).then((doc)=>{
       return doc? doc.userid: false;
     })


}



app.post('/api/exercise/add',(req,res)=>{
  let exer=req.body;
  insertUserExercise(exer).then((doc)=>{
    if(!doc){
      res.send("userid doesn't exist");
    }else{
      res.json({username:doc.username,userid:doc.userid, description:doc.description,date: new Date(doc.date)});
    }
  })

});
function insertUserExercise(add){
  let user_id= add.userId;
 return findUserId(user_id).then((exists)=>{
   if(exists){
   let newAdd= new UserExerciseEntry({
      username: exists,
      userid: add.userId,
      description: add.description,
     duration: add.duration,
      date:add.date
    });
    return newAdd.save()
   }
 });
}
function findUserId(user_id){
  return  UserEntry.findOne({userid: user_id}).then((doc)=>{
    return doc? doc.username:false;
  });
}

app.get('/api/exercise/log',(req,res)=>{
  let userId= req.query.userId;
  let arr;
  let length;
  findOut(userId).then((doc)=>{ 
    length=doc.length;
    arr= doc.map((d)=>{
                return {
                  description:d.description,
                  duration: d.duration,
                  date:d.date
                }
                });
    res.json({userid:userId, count:length, log:arr});
  })
})

function findOut(userId){
    let array= UserExerciseEntry.find({userid:userId});
    return array;
}

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
