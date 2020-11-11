import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ContextoUsuario } from '../App';
import M from 'materialize-css';

const Navbar = () => {
	const modalBuscar = useRef(null);
  const [ buscar, setbuscar ] = useState('');
  const [detalleUsuario,setdetalleUsuario] = useState([])
	const { state, dispatch } = useContext(ContextoUsuario);
	const history = useHistory();
	useEffect(() => {
		// inicia modal de materialize
		M.Modal.init(modalBuscar.current);
	},[]);
	const renderLista = () => {
		if (state) {
			return [
				<li key="1">
					<i data-target="modal1" className="material-icons modal-trigger" style={{ color: 'black' }}>
						search
					</i>
				</li>,
				<li key="2">
					<Link to="/perfil">Perfil</Link>
				</li>,
				<li key="3">
					<Link to="/crear-post">Crear Post</Link>
				</li>,
				<li key="4">
					<Link to="/post-que-sigo">Siguiendo</Link>
				</li>,
				<li key="5">
					<button
						className="btn #c62828 red darken-3"
						onClick={() => {
							localStorage.clear();
							dispatch({ type: 'Borrar' });
							history.push('/login');
						}}
					>
						Cerrar Sesión
					</button>
				</li>
			];
		} else {
			return [
				<li key="6">
					<Link to="/login">Login</Link>
				</li>,
				<li key="7">
					<Link to="/registro">Registrarse</Link>
				</li>
			];
		}
  };
  
  const fetchUsuarios = (consulta)=>{
      setbuscar(consulta)
      fetch('/buscar-usuarios',{
        method:"post",
        headers:{
          "Content-type":"application/json"

        },
        body:JSON.stringify({
          consulta:consulta
        })
      }).then(res=>res.json())
      .then(resultados=>{
        setdetalleUsuario(resultados.usuario) //nombre de usuario y email
      })
 
  }
	return (
		<nav>
			<div className="nav-wrapper white">
				<Link to={state ? '/' : '/login'} className="brand-logo left">
					Clonestagram
				</Link>
				<ul id="nav-mobile" className="right">
					{renderLista()}
				</ul>
			</div>

			{/* MODAL  ref useref hook*/}

			<div id="modal1" className="modal" ref={modalBuscar} style={{ color: 'black' }}>
				<div className="modal-content">
					<input
						type="text"
						placeholder="buscar usuarios"
						value={buscar}
						onChange={(e) => fetchUsuarios(e.target.value)}
					/>
				
        <ul class="collection">
          {detalleUsuario.map(item=>{

            // si item._id distinyto id usuario logueado...
            return <Link to={item._id !== state._id ?  "/perfil/"+item._id:"/perfil"} onClick={()=>{
              
              M.Modal.getInstance(modalBuscar.current).close()
              setbuscar('')  
            }}> <li class="collection-item">{item.email}</li> </Link> 
          })}

      </ul>
            
				</div>
				<div className="modal-footer">
					<button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setbuscar('')}>Cerrar</button>
          {/* mandar en blanco para resetear el campo */}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
