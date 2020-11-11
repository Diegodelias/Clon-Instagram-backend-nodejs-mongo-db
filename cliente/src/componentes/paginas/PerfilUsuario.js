import React,{useEffect,useState,useContext} from 'react';
import {ContextoUsuario} from '../../App'
import {useParams} from 'react-router-dom'

const Perfil = () => {

    const [usuarioPerfil,setusuarioPerfil] = useState(null)
    const {state,dispatch} = useContext(ContextoUsuario)
 
    const {usuarioid} = useParams()
    const [mostrarSeguir,setmostrarSeguir] =  useState(state?!state.siguiendo.includes(usuarioid):true)// si el state esta diponible incluye usuarioid en array seguidores del state corresponiendte  al usuario logueaod y se niega para que de false
    
    console.log(usuarioid)
    useEffect(()=>{
        fetch(`/usuario/${usuarioid}`,{
            headers:{
                "Authorization":"Bearer "+ localStorage.getItem("jwt")

            }
        }).then(res=>res.json())
        .then(resultado=>{

        
        setusuarioPerfil(resultado)

        })

    },[])

    const seguirUsuario = ()=> {
        fetch('/seguir',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt')

            },
            body:JSON.stringify({
                seguirId:usuarioid
            })
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                dispatch({type:"ACTUALIZAR",payload:{siguiendo:data.siguiendo,seguidores:data.seguidores}})
                localStorage.setItem("usuario",JSON.stringify(data))
                setusuarioPerfil((prevState)=>{

                    //actualizacion de seguidores
                        return{
                            ...prevState,
                            usuario:{
                            ...prevState.usuario,//rescribiendo valor usuario en prevState
                            seguidores:[...prevState.usuario.seguidores,data._id]}
                        }

                })
                setmostrarSeguir(false)
            })


      
    }   
    
    

    const dejarSeguirUsuario = ()=> {
        fetch('/dejarDeSeguir',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "Bearer "+localStorage.getItem('jwt')

            },
            body:JSON.stringify({
                dejarDeSeguirId:usuarioid
            })
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                dispatch({type:"ACTUALIZAR",payload:{siguiendo:data.siguiendo,siguiendo:data.seguidores}})
                localStorage.setItem("usuario",JSON.stringify(data))
                setusuarioPerfil((prevState)=>{
                    const nuevoSeguidor = prevState.usuario.seguidores.filter(item => item != data._id)

                    //actualizacion de seguidores
                        return{
                            ...prevState,
                            usuario:{
                            ...prevState.usuario,//rescribiendo valor usuario en prevState
                            seguidores: nuevoSeguidor 
                        
                        }


                        }

                })
                


            })


      
    }   
    






    return (
        <>
        {usuarioPerfil ?
        
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
                <div style={{display:"flex",justifyContent:"space-around", margin:"18px 0px", borderBottom:"1px solid grey"}}>
                    <div>
                        <img style={{width:"160px", height:"160px", borderRadius:"80px"}}
                        src={usuarioPerfil.usuario.foto}/>

                    </div>

                   <div>
                    <h4>{usuarioPerfil.usuario.nombre}</h4>
                    <h5>{usuarioPerfil.usuario.email}</h5>

                   <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h6>{usuarioPerfil.posts.length} posts</h6>
                        <h6>{usuarioPerfil.usuario.seguidores.length} seguidores</h6>
                        <h6>{usuarioPerfil.usuario.siguiendo.length} siguiendo</h6>

                   </div>
                {mostrarSeguir ?
                
                <button style={{
                    margin:"10px"
                }}className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>seguirUsuario()}>
                Seguir
                </button> :

            
                    <button style={{
                        margin:"10px"
                    }} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>dejarSeguirUsuario()}>
                    Dejar de  Seguir

                    </button>
                    
            
            
            
            }
               
              
                </div> 
                </div>
               
                <div className="galeria">

                    {
                        usuarioPerfil.posts.map(item=>{
                            return(
                                <img key={item._id} className="foto" src={item.foto} alt={item.titulo}/>
                            )

                        })

                    }
            
                </div>
            </div>

        
        
        
        
        : <h2>Cargando...</h2>}
            
         </>
       
    );
};

export default Perfil;