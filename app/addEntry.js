var mongoose =require('mongoose');


var userExerciseSchema= mongoose.Schema({
  username:String,
  userid: String,
  description: String,
  duration:Number,
  date: Date
});
module.exports= mongoose.model('UserExerciseEntry', userExerciseSchema)