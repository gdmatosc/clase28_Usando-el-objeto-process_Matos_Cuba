const mongoose=require('mongoose');

const MONGO_OPTIONS={
    useUnifiedTopology: true,
    useNewUrlParser: true,
    socketTimeoutMS: 30000,
    keepAlive: true,
    maxPoolSize: 50,
    autoIndex: false,
    retryWrites: false
  }
  
  const MONGO_USERNAME=process.env.MONGO_USERNAME;
  const MONGO_PASSWORD=process.env.MONGO_PASSWORD;
  const MONGO_HOST=process.env.MONGO_URL;
  
  const MONGO={
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    urlC: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`,
    urlL: 'mongodb://localhost:27017/dbCoderTest'
  }
  
let connProductosLDB=mongoose.createConnection(MONGO.urlC,MONGO_OPTIONS)

const productosCollection='productosGeneral'

const productosSchema=new mongoose.Schema({
    nombre:{type:String, require:true,max:100},
    img:{type:String, require:true,max:100},
    precio:{type:Number, require:true,max:100},
    descripcion:{type:String, require:true,max:100},
    promocion:{type:String, require:true,max:100},
})

const productosLDBModel=connProductosLDB.model(productosCollection,productosSchema)
module.exports=productosLDBModel;