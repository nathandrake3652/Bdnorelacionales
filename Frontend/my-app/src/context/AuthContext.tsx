import React, {createContext, useContext, useEffect, useState} from 'react';

interface TipoAutenticacion
{
    token: string | null;
    setToken: (token: string | null) => void;
}

const contextoAutenticacion = createContext<TipoAutenticacion | undefined>(undefined);

export const ProveedorAuth = ({children}:{children: React.ReactNode}) => {
    const [token, setToken] = useState<string | null>(() => {
        return sessionStorage.getItem('token');
    });

    useEffect(() => {
        if(token){
            sessionStorage.setItem('token',token);
        } else {
            sessionStorage.removeItem('token');
        }
    }, [token]);

    return (
        <contextoAutenticacion.Provider value = {{token, setToken}}>
            {children}
        </contextoAutenticacion.Provider>
    );
};

export const useAuth = (): TipoAutenticacion => {
    const contexto = useContext(contextoAutenticacion);
    if(!contexto) {
        throw new Error('el hook de useAuth debe ir dentro de un ProveedorAuth');
    }
    return contexto;
};