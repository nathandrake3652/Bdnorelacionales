import React,{SyntheticEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogin } from '../hooks/useLogin';

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

  const submit = (e: SyntheticEvent) => 
  {
    e.preventDefault();
    setErrorMsg('');
    login.mutate({username,password});
      
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
        {login.isError && <p>usuario o contraseña incorrectas </p>}
        {errorMsg && <p>{errorMsg}</p>}
        <p>Si no tienes cuenta, registrate <a href="/Register">aquí</a></p>
        <p>¿Olvidaste tu contraseña? <a href="/ForgotPassword">Recupera tu contraseña</a></p>
        
    </div>
  );
}