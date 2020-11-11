import React, { useState, useEffect, useContext } from 'react';
import { ContextoUsuario } from '../../App';
import {Link} from 'react-router-dom';
const SubscribirPosts = () => {
	const [ data, setData ] = useState([]);
	const { state, dispatch }  = useContext(ContextoUsuario); //state contiene detalles del usuario logueado
	useEffect(() => {
		fetch('/subscribirPosts', {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			}
		})
			.then((res) => res.json())
			.then((resultado) => {
				console.log("resultado"+resultado.posts)
				setData(resultado.posts);
			});
	}, []);
	const meGustaPost = (id) => {
		fetch('/meGusta', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				postId: id
			})
		})
			.then((res) => res.json())
			.then((resultado) => {
				
				const DataNuevo = data.map((item) => {
					//se forma nuevo array
					if (item._id === resultado._id) {
						return resultado;
					} else {
						return item;
					}
				});
				setData(DataNuevo);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const NomeGustaPost = (id) => {
		fetch('/noMeGusta', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwt')
			},
			body: JSON.stringify({
				postId: id
			})
		})
			.then((res) => res.json())
			.then((resultado) => {
				
				const DataNuevo = data.map((item) => { //data viene del usestate contien info  de los post request a /todoslosposts
					//se forma nuevo array
					if (item._id == resultado._id) {
						return resultado;
					} else {
						return item;
					}
				});
				setData(DataNuevo);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const crearComentario = (texto,postId)=>{
			fetch('/comentario',{
				method:"put",
				headers:{
					"Content-type":"application/json",
					"Authorization":"Bearer "+localStorage.getItem("jwt")
				},
				body:JSON.stringify({
					postId:postId,
					texto:texto
				})
			}).then(res=>res.json())
			.then(resultado=>{
				
				const DataNuevo = data.map((item) => {
					//se forma nuevo array
					if (item._id === resultado._id) {
						return resultado;
					} else {
						return item;
					}
					
				});
				setData(DataNuevo);
			}).catch(err=>{
				console.log(err)
			})
		
	}

	const borrarPost = (postid)=>{
		fetch(`/borrarpost/${postid}`,{
			method:"delete",
			headers:{
				Authorization:"Bearer "+localStorage.getItem("jwt")
			}



		}).then(res=>res.json())
		.then(resultado=>{

		
			const DataNuevo = data.filter(item=>{
						return item._id !== resultado._id

			})
			// actualiza el state con arreglo nuevo genrado con filter
			setData(DataNuevo);
		})
	}

	return (
		<div className="home">
		
			{data.map((item) => {
				return (
					<div className="card home-card" key={item._id}>
						
						<h5 style={{padding:"5px"}}><Link to={item.posteadoPor._id !== state._id?"/perfil/"+item.posteadoPor._id :"/perfil"}>{item.posteadoPor.nombre}</Link> 
						{item.posteadoPor._id === state._id
						&& <i className="material-icons" style={{float:"right"}}onClick={() => {borrarPost(item._id);}}>delete</i>
						} 
						</h5>

						<div className="card-image">
							<img src={item.foto} />
						</div>
						<div className="card-content">
                        <i className="material-icons" style={{color:"red"}}>favorite</i>
                          
							{item.meGusta.includes(state._id) ? 
								<i
									className="material-icons"
									onClick={() => {
										NomeGustaPost(item._id);
									}}
								>
									thumb_down
								</i>
							: 
								<i
									className="material-icons"
									onClick={() => {
										meGustaPost(item._id);
									}}
								>
									thumb_up
								</i>
							}

							<h6>{item.meGusta.length} me gusta</h6>
							<h6>{item.titulo}</h6>
							<p>{item.texto}</p>
							{
								item.comentarios.map(comentario=>{
									return (
										<h6 key={comentario._id}>
											<span style={{fontWeight:"500"}}>{comentario.posteadoPor.nombre}</span> {comentario.texto}
										</h6>
									)
								})

							}
							<form onSubmit={(e)=>{
								e.preventDefault()
								crearComentario(e.target[0].value,item._id)
							}}>
								<input type="text" placeholder="agregar comentario" />

							</form>
							
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default SubscribirPosts;
