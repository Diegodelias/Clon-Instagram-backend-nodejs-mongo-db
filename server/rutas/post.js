const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requerirLogin = require('../middleware/requerirLogin')
const Post = mongoose.model("Post")


router.get('/todosLosPosts',requerirLogin,(req,res)=>{
    Post.find()
    //referencia al modelo de  usuario  a los datos de ese usuarios o sea qu devolvera nombre id y password
    .populate("posteadoPor", "_id nombre") //en el segundo valor determina que es lo que se quiere traer con el poppulate del usuario en este caso id y el nombre
    .sort('-createdAt') //ordenado  descendente
    
    .populate("comentarios.posteadoPor","_id nombre")
    .then(posts=>{
        res.json({posts:posts})
    })
    .catch(err=>{
        console.log(err)

    })


})




////
router.post('/crearpost',requerirLogin,(req,res)=>{
    const {titulo, texto, foto} = req.body //almacena titulo y body que viene del front
    //si no trae nada
    if(!titulo || !texto || !foto){
      
      return  res.status(422).json({error:"Por favor rellenar todos lo campos"})
    }
    //para no guardar password de usuario en la base de datos se define como undefined
    req.usuario.password = undefined

    const post = new Post({
        titulo:titulo,
        texto: texto,
        foto:foto,
        posteadoPor: req.usuario //usuario viene de la que obtien  Usuario.findById el middleware requerirLogin
     })
    post.save().then(resultado=>{
        res.json({post:resultado})
    })
    .catch(err=>{
        console.log(err)
    })


})

router.get('/misPosts',requerirLogin,(req,res)=>{
    Post.find({posteadoPor:req.usuario._id})
    .populate("posteadoPor", "_id nombre")
    .then(miPost=>{
        res.json({miPost: miPost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/meGusta',requerirLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{ //se pasara postId desdeel fornt
    $push:{meGusta:req.usuario._id} //push de moongose agrega valor de id usuario logueado al array de megusta
},{
    new:true  //para que se acctualice
}).exec((err,resultado)=>{
    if(err){
        return res.status(422).json({error:err})
    } else {
        res.json(resultado)

    }
})
})





router.put('/noMeGusta',requerirLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{ //se pasara postId desdeel fornt
    $pull:{meGusta:req.usuario._id} //pull de moongose quita valor de id usuario logueado al array de megusta
},{
    new:true   //para que se acctualice
}).exec((err,resultado)=>{
    if(err){
        return res.status(422).json({error:err})
    } else {
        res.json(resultado)

    }
})

})


router.put('/comentario',requerirLogin,(req,res)=>{
    const comentario = {
        texto:req.body.texto,
        posteadoPor:req.usuario._id //viene del middleware

    }
    Post.findByIdAndUpdate(req.body.postId,{ //se pasara postId desdeel fornt
    $push:{comentarios:comentario} //push de moongose agrega valor de comentarios al array de comentarios
},{
    new:true  //para que se acctualice
})
.populate("comentario.posteadoPor","_id nombre") //trae id y nombte del usuario
.populate("posteadoPor","_id nombre")

.exec((err,resultado)=>{
    if(err){
        return res.status(422).json({error:err})
    } else {
        res.json(resultado)

    }
})
})

router.delete('/borrarpost/:postId',requerirLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("posteadoPor","_id")
    .exec((err,post)=>{ //ejecturar query
   
        if(err || !post){
            return res.status(422).json({error:err})
        }
        console.log(post.posteadoPor._id.toString())
        console.log( req.usuario._id.toString())
        if(post.posteadoPor._id.toString() === req.usuario._id.toString()){ //pasarlo a string porque como objeto nunca serían iguales
            post.remove()
            .then(resultado=>{
                res.json(resultado)
            }).catch(err=>{
                console.log(err)

            })

        }

    })

})



/////

//obtener todos los post del usuarioq ue estoy siguiendo
router.get('/subscribirPosts',requerirLogin,(req,res)=>{

    console.log(req.usuario.siguiendo)
    Post.find({posteadoPor:{$in:req.usuario.siguiendo}}) //$in en que array podemos buscar. busca en array siguiendo del usuario

    //referencia al modelo de  usuario  a los datos de ese usuarios o sea qu devolvera nombre id y password
    .populate("posteadoPor", "_id nombre") //en el segundo valor determina que es lo que se quiere traer con el poppulate del usuario en este caso id y el nombre
    .populate("comentarios.posteadoPor","_id nombre")
    .sort('-createdAt') //ordenado  descendente
    .then(posts=>{
        res.json({posts:posts})
    })
    .catch(err=>{
        console.log(err)

    })


})





module.exports = router