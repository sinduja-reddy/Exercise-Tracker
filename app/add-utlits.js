var UserExerciseEntry= require('./addEntry');
var  UserEntry = require('./userEntry');


module.exports.insertExercise= function insertUserExercise(add){
  let user_id= add.userId;
  
 return findUserId(user_id).then((exists)=>{
   if(exists){
   let newAdd= new UserExerciseEntry({
      username: exists,
      userid: add.userId,
      description: add.description,
     duration: add.duration,
      date: add.date
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

module.exports.findOut= function findOut(userId){
    let array= UserExerciseEntry.find({userid:userId});
    return array;
}