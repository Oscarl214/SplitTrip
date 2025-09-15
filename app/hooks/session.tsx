import { supabase } from "../utils/supabase";
import { useState , useEffect } from "react";


interface SessionType {
    id: string,
    email: string
}
export  function useSession (){

    const [ session,setSession]=useState<SessionType| null>(null)
    const [loading,setLoading]=useState(true)


    useEffect( () =>{


const fetchSession= async ()=>{

    const {data: {session},error}= await supabase.auth.getSession()
    
    
    if(error){
        
        
        console.log('There has been an error', error)
        setLoading(false)
        setSession(null)
    }else if (!session){
        setLoading(false)
        
        setSession(null)
    }
    
    else if (session.user.id && session.user.email){
    setLoading(false);
    setSession({id: session.user.id!, email: session.user.email!})
    }
}
fetchSession();

},

[])

return {session,loading};


}