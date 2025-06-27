import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { useNotificaciones } from '../hooks/useNotificacion';

export const Notificaciones = () => {
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    const {data: Notis, isLoading: cargaNotis} = useNotificaciones(user.rut);

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
    <div> 
        <h1>Notificaciones</h1>
            {cargaNotis? (<p>Cargando Notificaciones...</p>)
            : (
            <>
                <p>------------------------------</p>
                {Notis?.length > 0 ? (
                    <ul>
                        {Notis.map((noti: any) => (
                            <li key = {noti.id}> 
                                <span>{user.nombre}, {noti.mensaje}</span>
                                 <p>------------</p>
                            </li>
                        ))}
                    </ul>
                ) : (<p> No hay notificaciones</p>)
                }
            </>
            )}

    </div>
    );
    
};

export default Notificaciones;