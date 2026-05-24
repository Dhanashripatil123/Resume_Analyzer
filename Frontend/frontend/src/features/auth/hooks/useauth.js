import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {login,register,logout} from "../services/auth.api";

export const useAuth = ()=>{
   const context = useContext(AuthContext)
   const {user,setUser,loading,setLoading} = context     
   
   const handleLogin = async ({email,password})=>{
     setLoading(true)
     try{
         const data = await login({email,password})  
        setUser(data.user)
     }catch (err){
        console.log()
     }finally{
        setLoading(false)
     } 
}

   const handleRegister = async ({username,email,password})=>{
     setLoading(true)   
     const data = await register({username,email,password})  
     setUser(data.user)
     setLoading(false)
   }

   //  useEffect(()=>{
   //      const getAndSetUser = async()=>{
   //         try{
   //              const data = await getMe()
   //             setUser(data.user)
   //         }catch(err){
   //            console.log(err);
   //         }finally{
   //              setLoading(false);
   //         }
           
   //      }

   //      getAndSetUser()
   //  },[])

   const handleLogout = async ()=>{
     setLoading(true)   
    try{
     const data = await logout()  
     setUser(null)                                            
    }catch(err){
        console.log();
    }finally{
        setLoading(false)                                           
    }
    
   }

   return {user,loading,handleRegister,handleLogin,handleLogout}
}
