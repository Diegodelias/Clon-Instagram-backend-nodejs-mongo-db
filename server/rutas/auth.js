const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Usuario = mongoose.model("Usuario")
const bcrypt  = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requerirLogin = require('../middleware/requerirLogin')

router.post('/registro',(req,res)=>{
    const {nombre,email,password , foto} = req.body
    if(!nombre || !email || !password   )
    {
        //422 server entendio respuest aoeri no pudo procesar
      return  res.status(422).json({error:"por favor completar todos los campos"})
 }
    Usuario.findOne({email:email})  //encontrar un email igual al que estamos recibiendo por el frontEnd
    .then((UsuarioExiste)=>{
        if(UsuarioExiste){

                    return  res.status(422).json({error:"el usuario ya existe"}) 


                }
                //encriptar password
                bcrypt.hash(password,12)
                .then(passwordEncriptado=>{
                    const usuario = new Usuario({
                        email,
                        password:passwordEncriptado,
                        nombre,
                        foto:foto
                    
                    })


              
                
                //si el usuario no existe se crea
              

                usuario.save() //guardar nuevo usuario
                .then(usuario =>{
                    res.json({message:"Usuario creado correctamente"})
                })
                .catch(err=>{
                       console.log(err) 

                })

            })
            .catch(err=>{  //catch para primer the del findone
                console.log(err)
            

            })
          

})
})

// router.get('/protegida',requerirLogin,(req,res)=>{
//     res.send("hola mundo")

// })

router.post('/login',(req,res)=>{
    const {email,password, nombre} = req.body
    if(!email || !password  ){
        res.status(422).json({error:"por favor agregar email o password " }) //422 el server eqtendio la peticion pero no la puede procesar

    }
    Usuario.findOne({email:email})
    .then(usuarioExiste=>{
        //si el usuario no existe en la db
        if(!usuarioExiste)  {
          return  res.status(422).json({error:"Email o passwords inválido "})
        }
        //si el usuario existe comprarar password pasado desde el front end con password del usuario encontrado
        bcrypt.compare(password,usuarioExiste.password)
        .then(sonIguales=>{
            if(sonIguales){
               // res.json({message: "logueado exitosamente"})
               //genera token jwt en base id de usuarioExiste
               const token = jwt.sign({_id:usuarioExiste._id},JWT_SECRET)
               const {_id,nombre,email,seguidores,siguiendo,foto} = usuarioExiste

               res.json({token:token, usuario:{_id,nombre,email,seguidores,siguiendo,foto}})
               console.log(token)

            }
            else {

                return  res.status(422).json({error:"Email o passwords inválido "})

            }
        })
        .catch(err=>{
            console.log(err)
        })

    })



})
module.exports = router