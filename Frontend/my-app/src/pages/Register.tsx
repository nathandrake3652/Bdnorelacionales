import React,{SyntheticEvent, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';

export const Register = () => { //Hooks
  const [username, setUser] = useState('');
  const [correo,setCorreo] = useState('');
  const [password,setPassword] = useState('');
  const [type,setType] = useState('registered');
  const [errorMsg,setErrorMsg] = useState('');
  const navigate = useNavigate();

  const register = useRegister(() => {
    navigate('/Login');
    },
    (error) => {
      setErrorMsg(error);
    }
  );

  const enviar = (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorMsg('');
    register.mutate({username,correo,password,type});
  };

  return (
    <div>
        <h1>Registro</h1>
        <form onSubmit={enviar}>
            <label>Ingrese su Rut: </label>
            <input type = "text" name = "username" placeholder = 'Ingrese su nombre de usuario...' required value={username}
              onChange={e => setUser(e.target.value)}
            />

            <label>Correo Electronico: </label>
            <input type = "email" name = "email" placeholder = 'Ingrese un correo electronico porfavor...' required value={correo}
              onChange={e => setCorreo(e.target.value)}

            />
            <label>Contraseña: </label>
            <input type = "password" name = "password" placeholder = 'Ingrese una contraseña...' required value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit" disabled = {register.isPending}>
              {register.isPending? 'Registrando...🗿' : 'Registrarse'}
            </button>
        </form>
        {errorMsg && <p>{errorMsg}</p>}
    </div>
  );
}