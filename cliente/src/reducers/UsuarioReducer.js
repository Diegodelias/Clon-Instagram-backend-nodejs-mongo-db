export const stateInicial = null
export const reducer = (state,action)=>{
    if(action.type="Usuario"){
        return action.payload
    }

    if(action.type =="Borrar"){
        return null //setea state a null
    }

    if(action.type =="ACTUALIZAR"){
        return{
                ...state,
                seguidores:action.payload.seguidores,
                siguiendo:action.payload.siguiendo

        }

    }


    if(action.type == "ACTUALIZAFOTOPERFIL"){
        return{
            ...state,
            foto:action.payload

    }


    }
    return state //actualiza state
}