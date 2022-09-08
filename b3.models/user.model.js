const mongoose=require('mongoose')

let connUser=mongoose.createConnection('mongodb://localhost:27017/dbCoderTest',{
    useUnifiedTopology:true,
    useNewUrlParser:true
})

module.exports=connUser.model('Users',{
    username: String,
    password: String,
    name: String
})