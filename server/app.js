const express = require('express')
const app = express()
const puerto = 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')

//estableciendo conexion a bd mongo
mongoose.connect(MONGOURI,{useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false })
mongoose.connection.on('connected',()=>{ //caundo etablezca la conexion
    console.log("conectado a mongo");
})
//
mongoose.connection.on('error',()=>{ //caundo etablezca la conexion
    console.log("error de conexion", err);
})



require('./modelos/usuario')
require('./modelos/post')

app.use(express.json()) //parsear todas las request entrantes a json

app.use(require('./rutas/auth'))
app.use(require('./rutas/post'))
app.use(require('./rutas/usuario'))


app.listen(puerto,()=>{
    console.log("el server está corrien en el puerto ", puerto)

})