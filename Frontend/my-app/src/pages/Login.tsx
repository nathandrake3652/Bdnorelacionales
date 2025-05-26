import React,{SyntheticEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin, useAnonLogin } from '../hooks/useLogin';


export const Login = () => {
  const [username,setUser] = useState('');
  const [password,setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const {setToken} = useAuth();
  const navigate = useNavigate();

  

  const login = useLogin((token) => {
    
    setToken(token);
    console.log(setToken(token));
    navigate('/Home');
    
  },
  (error)=>{
    setErrorMsg(error);
  }
  );

  const loginAnon = useAnonLogin((token) => {
    
    setToken(token);
    console.log(setToken(token));
    navigate('/Home');
    
  },
  (error)=>{
    setErrorMsg(error);
  }
  );

  const submit = (e: SyntheticEvent) => 
  {
    e.preventDefault();
    setErrorMsg('');
    login.mutate({username,password});
      
  };

  const handleAnonymous = () => {
    setErrorMsg('');
    loginAnon.mutate({ type: 'anon' });
  };


  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={submit}>
            <label>Rut: </label>
            <input type="text" name="username" id = "username" required value = {username}
              onChange = {e => setUser(e.target.value)}
                   placeholder = "Ingrese porfavor su nombre de usuario."
            />
            <label>Contraseña: </label>
            <input type="password" name="password" required value = {password}
              onChange = {e => setPassword(e.target.value)}
                   placeholder = "Ingrese porfavor su contraseña."
            />
            <button type="submit" value="Submit" disabled={login.isPending}>
              {login.isPending? 'iniciando sesion...': 'Login'}
            </button>
        </form>

      <div className="separator">
        <span>o</span>
      </div>
      
      <button 
        onClick={handleAnonymous} 
        disabled={loginAnon.isPending}
        className="boton-anonimo"
      >
        {loginAnon.isPending ? 'Creando sesión...' : 'Continuar como Anónimo'}
      </button>
  
      {login.isError && <p className="error-message">Usuario o contraseña incorrectos</p>}
      {loginAnon.isError && <p className="error-message">{errorMsg}</p>}
      
      <div className="links-register">
        <p>¿No tienes cuenta? <a href="/Register">Regístrate aquí</a></p>
        <p>¿Olvidaste tu contraseña? <a href="/ForgotPassword">Recupérala aquí</a></p>
      </div>
        
    </div>
  );
}