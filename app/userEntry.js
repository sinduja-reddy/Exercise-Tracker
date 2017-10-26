var mongoose =require('mongoose');

var userSchema= mongoose.Schema({
  username: String,
  userid:{ type: String, index:true}
});
module.exports=mongoose.model('UserEntry', userSchema)
