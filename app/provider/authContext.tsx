import { createContext, ReactNode, useContext } from "react";
import { useSession } from "../hooks/session";

interface SessionType {
    id: string,
    email: string,
    name?: string
}

interface AuthContextType{
    contextsession: SessionType | null;
    loading: boolean
    setContextSession: (session: SessionType | null) => void; 
  }



const AuthContext=createContext<undefined | AuthContextType>(undefined)





export const AuthProvider= ({children}: {children:ReactNode})=>{


    const {contextsession,loading,setContextSession}= useSession();




    return (

    <AuthContext.Provider value={{contextsession,loading, setContextSession}}>
        {children}
    </AuthContext.Provider>
    )
}


export const useAuth=()=>{
    const context=useContext(AuthContext)

    if(context===undefined){
        throw new Error('Auth session must be within a Auth provider')
    }
    return context
}



