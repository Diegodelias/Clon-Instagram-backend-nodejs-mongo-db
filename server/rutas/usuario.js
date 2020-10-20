const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requerirLogin = require('../middleware/requerirLogin')
const Post = mongoose.model("Post")
const Usuario = mongoose.model("Usuario")

//ruta para ver perfil de otro usaurio
router.get('/usuario/:id',requerirLogin,(req,res)=>{
    //encontrar usuario
    Usuario.findOne({_id:req.params.id})
    .select("-password")//trae todos los campos del usuario menos el password
   
    .then(usuario=>{
        console.log(usuario)
        console.log(req.params.id)
        //encontrar post creado por el usuario
      Post.find({posteadoPor:req.params.id})
       .populate("posteadoPor","_id nombre")
       .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }

            res.json({usuario, posts})

        })



    }).catch(err=>{
        return res.status(404).json({error:"Usuario no encontrado"})
    })
})

router.put('/seguir',requerirLogin,(req,res)=>{
    Usuario.findByIdAndUpdate(req.body.seguirId,{
        $push:{seguidores:req.usuario._id}

    },{
        new:true
    },(err,resultado)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        Usuario.findByIdAndUpdate(req.usuario._id,{
            $push:{siguiendo:req.body.seguirId},
            
            
        },{new:true}).then(resultado=>{
            res.json(resultado)

        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }

        )

})



router.put('/dejarDeSeguir',requerirLogin,(req,res)=>{
    Usuario.findByIdAndUpdate(req.body.dejarDeSeguir,{
        $pull:{seguidores:req.usuario._id}

    },{
        new:true
    },(err,resultado)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        Usuario.findByIdAndUpdate(req.usuario._id,{
            $pull:{siguiendo:req.body.dejarDeSeguir},
            
            
        },{new:true}).then(resultado=>{
            res.json(resultado)

        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }

        )

})

router.put('/actualizaFoto',requerirLogin,(req,res)=>{
    Usuario.findByIdAndUpdate(req.usuario._id,{$set:{foto:req.body.foto}},{new:true},(err,resultado)=>{
        if(err){
            return res.status(422).json({error:"la foto no se ppuede mostrar"})
        }
        res.json(resultado)
    })
})

router.post('/buscar-usuarios',(req,res)=>{
    let patron= new RegExp("^"+req.body.query)
    Usuario.find({email:{$regex:patron}})
    .select("_id email") //solo va seleccionar id e email
    .then(usuario=>{
        res.json({usuario:usuario})
    }).catch(err=>{
        console.log(err)
    })

})

module.exports = router