import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";



interface SessionType {
    id: string,
    email: string 
}





export  function useSession (){

    const [ contextsession,setContextSession]=useState<SessionType| null>(null)
    const [loading,setLoading]=useState(true)


    useEffect( () =>{

const fetchSession= async ()=>{

    const {data: {session},error}= await supabase.auth.getSession()
    
    
    if(error){
        console.log('There has been an error', error)
        setLoading(false)
        setContextSession(null)
    }else if (!session){
        setLoading(false)
        setContextSession(null)
    }
    else if (session.user.id && session.user.email){
        setLoading(false);
        setContextSession({id: session.user.id!, email: session.user.email!})
    }
}

fetchSession();

// Listen for auth state changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event, session?.user?.id);
    
    if (event === 'SIGNED_OUT' || !session) {
        setContextSession(null);
        setLoading(false);
    } else if (event === 'SIGNED_IN' && session?.user?.id && session?.user?.email) {
        setContextSession({id: session.user.id, email: session.user.email});
        setLoading(false);
    }
});

return () => {
    subscription.unsubscribe();
};

}, [])

return {contextsession, loading, setContextSession};


}



