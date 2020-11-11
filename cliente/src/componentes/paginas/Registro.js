import React, { useState, useEffect }  from 'react';
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'


const Registro = () => {
	const history = useHistory()
	const [nombre,setNombre] = useState("")
	const [password,setPassword] = useState("")
	const [email,setEmail] = useState("")
	const [foto,setFoto] = useState("")
	const [url,setUrl] = useState(undefined)
	useEffect(()=>{
		if(url){
			subirInputs() 


		}

	},[url])

	const subirInputs = ()=>{
		if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "email inválido",classes:"#c62828 red darken-3"})
            return
        }
		fetch("/registro",{
			method:"post",
			headers:{
			"Content-Type":"application/json"
		},
			body:JSON.stringify({
				nombre:nombre,
				password:password,
				email:email,
				foto:url
			})

			}).then(res=>res.json())//convertir respuesta a json
			.then(data=>{
				if(data.error){
					M.toast({html: data.error,classes:"#c62828 red darken-3"})

				}else{
					M.toast({html:data.message,classes:"#43a047 green darken-1"})
					history.push('/login')
				}
			}).catch(err=>{
				console.log(err)
			})

	}
	const subirFoto = ()=>{
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
	const PostData = ()=>{
		if(foto){
			subirFoto() 
		}else{

			subirInputs() 
		}
		
	}
	return (
		<div className="mycard">
			<div className="card login-card input-field ">
				<h2>Clonestagram</h2>
                <input type="text" placeholder="nombre"  value={nombre} onChange={(e)=>setNombre(e.target.value)}/>
				<input type="text" placeholder="email"  value={email} onChange={(e)=>setEmail(e.target.value)} />
				<input type="password" placeholder="password"  value={password} onChange={(e)=>setPassword(e.target.value)}/>

				
				<div className="file-field input-field">
                <div className="btn blue lighten-2">
                    <span>Agregar Foto</span>
                    <input type="file" onChange={(e)=>setFoto(e.target.files[0])}/>
                 </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            	</div>


				<button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=>PostData()} >
					Registro
					
				</button>

                <h5>
                    <Link to="/login">¿Ya estás registrado?</Link>
                </h5>
			</div>
		</div>
	);
};

export default Registro;
