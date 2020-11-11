import React, {useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CrearPost = () => {
    const history = useHistory()
    const [titulo,setTitulo] = useState("")
    const [texto,setTexto] = useState("")
    const [foto,setFoto] = useState("")
    const [url,setUrl] = useState("")

    useEffect(()=>{
        if(url){ //solo si existe url actua el useeffect

            fetch("/crearpost",{
                method:"post",
                headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
                body:JSON.stringify({
                
                    titulo:titulo,
                    texto:texto,
                    foto:url
                })
    
                }).then(res=>res.json())//convertir respuesta a json
                .then(data=>{
                    if(data.error){
                        M.toast({html: data.error,classes:"#c62828 red darken-3"})
    
                    }else{
                        M.toast({html:"Tu post fue creado correctamente!",classes:"#43a047 green darken-1"})
                        history.push('/')
                    }
                }).catch(err=>{
                    console.log(err)
                })
    



        }
        

    },[url])//cuando cambie la url o s se seteee la imagen el use effect actua

    const  DetallesPost = ()=>{
        const data = new FormData()
      
        data.append("file",foto)
        data.append("upload_preset","clonestagram")
        data.append("cloud_name","dkj7iqhfy")
        fetch("https://api.cloudinary.com/v1_1/dkj7iqhfy/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json()
        
        )
        .then(data=>{
           
            setUrl(data.url)
           
           
        })
        .then(data=>{
            console.log(url)

        })
        .catch(err=>{
            
            console.log(err)
        })

      
     

      




      






    }
    return (
        <div className="card input-filed" style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"



        }}>
            <input type="text" placeholder="titulo" value={titulo}  onChange={(e)=>setTitulo(e.target.value)}/>
            <input type="text" placeholder="comentario"  value={texto}  onChange={(e)=>setTexto(e.target.value)}/>


            <div className="file-field input-field">
                <div className="btn blue lighten-2">
                    <span>Agregar Foto</span>
                    <input type="file" onChange={(e)=>setFoto(e.target.files[0])}/>
                 </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" 
            onClick={()=>DetallesPost()}>
					Crear Post
					
			</button>



            
            
        </div>
    );
};

export default CrearPost;