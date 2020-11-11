import React,{ useState, useContext, } from 'react';
import {Link, useHistory} from 'react-router-dom'
import {ContextoUsuario} from '../../App'

import M from 'materialize-css'

const Login = () => {

	const {state,dispatch} = useContext(ContextoUsuario)

	const history = useHistory()
	
	const [password,setPassword] = useState("")
	const [email,setEmail] = useState("")
	const PostData = ()=>{
		if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "email inválido",classes:"#c62828 red darken-3"})
            return
        }
		fetch("/login",{
			method:"post",
			headers:{
			"Content-Type":"application/json"
		},
			body:JSON.stringify({
			
				password:password,
				email:email
			})

			}).then(res=>res.json())//convertir respuesta a json
			.then(data=>{
				if(data.error){
					M.toast({html: data.error,classes:"#c62828 red darken-3"})

				}else{
					// alamcena token y datos del usuario en localstorage
					localStorage.setItem("jwt",data.token)
					//localStorage.setItem("user",JSON.stringify(data.usuario))
					localStorage.setItem("usuario",JSON.stringify(data.usuario))
					dispatch({type:"Usuario",payload:data.usuario})
					M.toast({html:"Logueado con exito!",classes:"#43a047 green darken-1"})
					history.push('/')
				}
			}).catch(err=>{
				console.log(err)
			})

		
	}

	return (
		
		<div className="mycard">
			<div className="card login-card input-field ">
				<h2>Clonestagram</h2>
				<input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>

				<input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>


				<button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>PostData()}>
					Login
					
				</button>
                <h5>
                <Link to="/registro">¿No estás registrado?</Link>

                </h5>
			</div>
		</div>
	);
};

export default Login;
