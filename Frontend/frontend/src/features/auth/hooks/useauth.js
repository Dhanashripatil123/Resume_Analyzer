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
         localStorage.setItem("token", data.token)
         return data
     }catch (err){
<<<<<<< HEAD
        console.log(err.response?.data || err.message)
=======
        console.error(err)
        throw err
>>>>>>> f7887e4 (restore file)
     }finally{
        setLoading(false)
     }
}

   const handleRegister = async ({username,email,password})=>{
<<<<<<< HEAD
  setLoading(true)

  try{
     const data = await register({username,email,password})

     if(data){
        setUser(data.user)
     }

  }catch(err){
      console.log(err)
  }finally{
      setLoading(false)
  }
}
=======
     setLoading(true)   
     const data = await register({username,email,password})  
     setUser(data.user)
     localStorage.setItem("token", data.token)
     setLoading(false)
   }
>>>>>>> f7887e4 (restore file)

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
<<<<<<< HEAD
     setLoading(true)   
    try{
     const data = await logout()  
     setUser(null)                                            
    }catch(err){
        console.log(err);
    }finally{
        setLoading(false)                                           
    }
    
=======
     setLoading(true)
     try{
       await logout()
       setUser(null)
       localStorage.removeItem("token")
     }catch(err){
       console.error(err)
     }finally{
       setLoading(false)
     }
>>>>>>> f7887e4 (restore file)
   }

   return {user,loading,handleRegister,handleLogin,handleLogout}
}
