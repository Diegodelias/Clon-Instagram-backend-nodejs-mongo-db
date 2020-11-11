const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const mongoose = require('mongoose')
const Usuario = mongoose.model("Usuario")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //si no viene authorization en headers
    if(!authorization){
        res.status(401).json({error:"tenes que estar logueado"})   //no authoriazado
    }
    //si viene authorization en headers
    //reemplazar Bearer del heder para guardar solo el token
    const token = authorization.replace("Bearer ","")
    //verificar el token
    jwt.verify(token, JWT_SECRET,(err,payload)=>{
        if(err){
          return  res.status(401).json({error:"tiene que estar logueado "})

        }
       //si la verificación fue exitosa
        const {_id} = payload  //destructuring _id del usuario  con el que se había genrado token (ruta login)
        //si encuentra usuario con ese id
        Usuario.findById(_id).then( dataUsuario=>{
            req.usuario = dataUsuario
            next()
        })
        

    })
}