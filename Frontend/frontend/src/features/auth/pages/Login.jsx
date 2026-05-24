import { useState } from 'react';
import "../auth.form.scss";
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useauth';

const Login = () => {

 const {loading,handleLogin} = useAuth();
 const navigate = useNavigate();

 const[email,setEmail] = useState("")
 const[password,setPassword] = useState("")
 const[error,setError] = useState(null)
  
   const handleSubmit = async(e)=>{
       e.preventDefault()
       setError(null)
       if (!email || !password) {
          setError("Please enter both email and password.")
          return
       }

       try {
         await handleLogin({email,password})
         navigate('/interview-home');
       } catch(err) {
         const message = err?.response?.data?.message || err.message || "Login failed"
         setError(message)
         console.error('Login failed:', err)
       }
   }

  if(loading){
     return(<main><h1>Loading...</h1></main>)
  }

   return(
     <main>
       <div className='form-container'>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor='email'>Email</label>
            <input
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              type="email"
              id="email"
              name='email'
              placeholder='Enter email address'
              required
            />
          </div>
          <div className='input-group'>
            <label htmlFor='password'>Password</label>
            <input
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
              type="password"
              id="password"
              name='password'
              placeholder='Enter password'
              required
            />
          </div>
          {error && <p className='error-message'>{error}</p>}
          <button className='button primary-button' type='submit' disabled={loading}>Login</button>
        </form>

         <p>you dont have an account <Link to={"/register"}>register</Link></p>
       </div>

     </main>                                             
   )                                               
}

export default Login