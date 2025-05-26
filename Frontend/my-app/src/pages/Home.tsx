import React from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export const Home = () => {
    console.log("Home");
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    

    if(!token)
    {
        
        navigate('/Login');
        return null;
    }
    
    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token');
        navigate('/Login');
    }


    if(cargauser)
    {
        return <div> Cargando... </div>;
    }
    
    if(isError)
    {
        setToken(null);
        navigate('/login');
        return null;
    }

    return (
    <div className="Home">
      {user?.type === 'anon' ? (
        <>
          <h2>Estás navegando como usuario anónimo</h2>
          <p>Tu sesión es temporal y se perderá al cerrar el navegador</p>
        </>
      ) : (
        <>
          <h2>Bienvenido, {user?.username}</h2>
          <p>Correo electrónico: {user?.email}</p>
        </>
      )}
      
      <button onClick={logout} className="Botón-logout">
        Cerrar sesión
      </button>
    </div>
    );
    
};

export default Home;