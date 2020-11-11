import React,{useEffect,useState,useContext} from 'react';
import {ContextoUsuario} from '../../App'


const Perfil = () => {
    const [misfotos,setmisfotos] = useState([])
    const {state,dispatch} = useContext(ContextoUsuario)
    const [imagen,setImagen] = useState("")

    
    useEffect(()=>{
        fetch('/misPosts',{
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("jwt")

            }
        }).then(res=>res.json())
        .then(resultado=>{

           setmisfotos(resultado.miPost)

        })

    },[])
    useEffect(()=>{
        if(imagen){

            const data = new FormData()
      
            data.append("file",imagen)
            data.append("upload_preset","clonestagram")
            data.append("cloud_name","dkj7iqhfy")
            fetch("https://api.cloudinary.com/v1_1/dkj7iqhfy/image/upload",{
                method:"post",
                body:data
            })
            .then(res=>res.json()
            
            )
            .then(data=>{
               
               
                console.log(data)
                // localStorage.setItem("usuario", JSON.stringify({...state,foto:data.foto}))
                // dispatch({type:"ACTUALIZAFOTOPERFIL",payload:data.foto})
                fetch('/actualizaFoto',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        
                        foto:data.url

                    })





                }).then(res=>res.json())
                .then(resultado=>{
                  
                  localStorage.setItem("usuario",JSON.stringify({...state,foto:resultado.foto}))
                   
                    dispatch({type:"ACTUALIZAFOTOPERFIL",payload:resultado})
                   // window.location.reload()
            })
           
            })
            .catch(err=>{
                
                console.log(err)
            })
    
        }


    },[imagen])
    const actualizarFotoPerfil = (file)=>{
        setImagen(file)
     

    }
    
    
    return (
            <div style={{maxWidth:"550px", margin:"0px auto"}}>
                <div style={{ margin:"18px 0px", borderBottom:"1px solid grey"}}>


               
                <div style={{display:"flex",justifyContent:"space-around"}}>
                    <div>
                        <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                        src={state?state.foto:"cargando..."}/>

                        
			
                    </div>

                   <div>
                    <h4>{state?state.nombre:"cargando"}</h4>
                    <h5>{state?state.email:"cargando"}</h5>

                   <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                    <h6>{misfotos.length} post</h6>
                    <h6>{state?state.seguidores.length:"0"} seguidores</h6>
                    <h6>{state?state.siguiendo.length:"0"} siguiendo</h6>

                   </div>
                       
                </div> 
                </div>
              

                <div className="file-field input-field" style={{margin:"10px"}}>
                <div className="btn blue lighten-2">
                    <span>Actualizar Foto</span>
                    <input type="file" onChange={(e)=>actualizarFotoPerfil(e.target.files[0])}/>
                 </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            	</div>

                </div>

                <div className="galeria">

                    {
                        misfotos.map(item=>{
                            return(
                                <img key={item._id} className="foto" src={item.foto} alt={item.titulo}/>
                            )

                        })

                    }
            
                </div>
            </div>

         
       
    );
};

export default Perfil;