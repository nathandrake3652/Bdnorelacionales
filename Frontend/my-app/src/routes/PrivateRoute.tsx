import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PropRutaspriv {
    children: React.ReactNode;
}

export const PrivateRoute = ({children}: PropRutaspriv) => {
    const {token} = useAuth();

    if(!token)
    {
        return <Navigate to = '/Login'/>;
    }

    return <>{children}</>;
}