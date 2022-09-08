/*
const mongoose=require('mongoose');
const productosCollection='productosGeneral'

let connProductosLDB=mongoose.createConnection('mongodb://localhost:27017/dbCoderTest',{
    useUnifiedTopology:true,
    useNewUrlParser:true
})

const productosSchema=new mongoose.Schema({
    nombre:{type:String, require:true,max:100},
    img:{type:String, require:true,max:100},
    precio:{type:Number, require:true,max:100},
    descripcion:{type:String, require:true,max:100},
    promocion:{type:String, require:true,max:100},
})

const productosLDBModel=connProductosLDB.model(productosCollection,productosSchema)
module.exports=productosLDBModel;
*/