import Navbar from './componentes/Navbar';
import "./App.css"
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './componentes/paginas/Home'; 
import Login from './componentes/paginas/Login'; 
import Registro from './componentes/paginas/Registro'; 
import Perfil from './componentes/paginas/Perfil'; 
import CrearPost from './componentes/paginas/CrearPost'; 
import React,{useEffect,createContext,useReducer,useContext} from 'react';
import {reducer,stateInicial} from './reducers/UsuarioReducer';
import PerfilUsuario from './componentes/paginas/PerfilUsuario'; 
import SubscribirPosts from './componentes/paginas/subscribirPosts'; 


export const ContextoUsuario= createContext()

const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(ContextoUsuario)
  
  useEffect(()=>{
    const usuario = JSON.parse(localStorage.getItem("user"))
    if(usuario){
      dispatch({type:"Usuario",payload:usuario})
      // history.push('/')

    }else{
      history.push('/login')
    }

  },[])
return(
<Switch>
  <Route exact path="/">
  <Home/>
</Route>
<Route path="/login">
  <Login/>
</Route>
<Route path="/registro">
 <Registro/>
</Route>
<Route exact path="/perfil">
 <Perfil/>
</Route>
<Route path="/crear-post">
 <CrearPost/>
</Route>
<Route path="/perfil/:usuarioid">
 <PerfilUsuario/>
</Route>
<Route path="/post-que-sigo">
 <SubscribirPosts/>
</Route>
</Switch>


)


}
function App() {
  const [state,dispatch] = useReducer(reducer,stateInicial)
  return (
    // tiene accesos a state y dispatch en todos lso componentes
    <ContextoUsuario.Provider value={{state:state,dispatch:dispatch}}>
    <BrowserRouter>
     <Navbar/>
     <Routing/>

     </BrowserRouter>
     </ContextoUsuario.Provider>
  );
}

export default App;
