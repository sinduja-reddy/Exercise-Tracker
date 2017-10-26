var UserEntry=require('./userEntry');
const shortid = require('shortid');



module.exports.insertUser= function insertUser(user){
  let newUser= new UserEntry({
      username:user,
      userid: shortid.generate()
    });
    return newUser.save()
}

module.exports.isDuplicateUser= function isDuplicateUser(user){
     return UserEntry.findOne({'username': user}).then((doc)=>{
       return doc? doc.userid: false;
     })
}

