const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const SchemaUsuario = new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    foto:{
        type:String,
        default:""

    },
    seguidores:[{type:ObjectId,ref:"Usuario"}],
    siguiendo:[{type:ObjectId,ref:"Usuario"}]



})

    mongoose.model("Usuario", SchemaUsuario)




