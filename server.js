const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const shortid = require('shortid');


const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )
mongoose.Promise = global.Promise;


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var userSchema= mongoose.Schema({
  username: String,
  id:{ type: Number, index:true}
});
var UserEntry = mongoose.model('UserEntry', userSchema);



app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.post('/api/exercise/new-user',(req,res)=>{
      var user= req.body.username;
  res.send(user);
  });

app.post('/api/exercise/add',(req,res)=>{
      var excercise= req.body;
  res.send(excercise);

});

function insertUser(){
  let id= shortid.generate();
  return id;
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
