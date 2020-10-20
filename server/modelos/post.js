const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types


const schemaPost = new mongoose.Schema({
    titulo:{
        type:String,
        required:true
    },
    texto:{
        type:String,
        required:true
    },
    foto:{
        type:String,
        default:"sin foto"
    },
    meGusta:[{type:ObjectId,ref:"Usuario"}],
    comentarios:[{texto:String,posteadoPor:{type:ObjectId, ref:"Usuario"}
}],

    posteadoPor:{
        type:ObjectId,//id del usuario refiere al modelo usuario
        ref:"Usuario"


    }



})

mongoose.model("Post",schemaPost)