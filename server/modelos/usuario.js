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
        
    },
    foto:{
        type:String,
        
        default:"https://res.cloudinary.com/dkj7iqhfy/image/upload/v1604936478/noImage_beni7n.jpg"

    },
    seguidores:[{type:ObjectId,ref:"Usuario"}],
    siguiendo:[{type:ObjectId,ref:"Usuario"}]



})

    mongoose.model("Usuario", SchemaUsuario)




