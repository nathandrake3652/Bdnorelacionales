import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { usePublicaciones, usePublicacionesPorEtiqueta, useCrearPublicacion, useVotarPublicacion, useDarPremio } from '../hooks/usePublicaciones';
import { useCrearComentario, useVotarComentario, useComentarios } from '../hooks/useComentarios';

export const Home = () => {
    console.log("Home");
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    
    const [filtro, setFiltro] = useState({
        filtro: "Sin filtro" 
    });

    //Pop up para hacer publicaciones.
    const [mostrarModal, setMostrarModal] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [tags, setTags] = useState("");

    const { data: publicaciones, isLoading: cargandoPublicaciones } = usePublicaciones(filtro);
    const { mutate: crearPublicacion } = useCrearPublicacion();

    if (!token) {
        navigate('/Login');
        return null;
    }

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


    if(cargauser || cargandoPublicaciones)
    {
        return <div> Cargando... </div>;
    }
    
    if(isError)
    {
        setToken(null);
        navigate('/login');
        return null;
    }

    const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFiltro({
            filtro: e.target.value
        });
    };

    const handleCrearPublicacion = () => {
        if (!titulo || !contenido) {
            alert("Título y contenido son requeridos");
            return;
        }

        const tagsArray = tags.split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.substring(1));
        
        crearPublicacion({
            title: titulo,
            content: contenido,
            authorId: user.id, 
            tags: tagsArray,
            score: 0 
        });

        setTitulo("");
        setContenido("");
        setTags("");
        setMostrarModal(false);
    };

    return (
    <div className="Home">

      <div className="filtro-publicaciones">
        <label htmlFor="filtro-publicaciones">Filtrar publicaciones:</label>
        <select 
              id="filtro-publicaciones"
              value={filtro.filtro}
              onChange={handleFiltroChange}
            >
              <option value="Sin filtro">Sin filtro</option>
              <option value="Puntuación (Mayor a Menor)">Puntuación (Mayor a Menor)</option>
              <option value="Puntuación (Menor a Mayor)">Puntuación (Menor a Mayor)</option>
              <option value="Más recientes">Más recientes</option>
        </select>
      </div>

            
      <div className="lista-publicaciones">
          {publicaciones.map((publicacion: any) => (
              <div key={publicacion.id} className="publicacion">
                  <p>Puntuación: {publicacion.score}</p>
                  <h3>{publicacion.author}</h3>
                  <h3>{publicacion.title}</h3>
                  <p>{publicacion.content}</p>
              </div>
          ))}
      </div>
      


      {user.type === 'anonimo' ? (
        <>
          <h2>Estás navegando como usuario anónimo</h2>
          <p>Tu sesión es temporal y se perderá al cerrar el navegador</p>

        </>
      ) : (
        <>
          <h2>Bienvenido, {user.username}</h2>
          <button onClick={()=> navigate('/Notificaciones')}>Notificaciones</button>

          
        </>
      )}
      
      <button onClick={logout} className="Botón-logout">
        Cerrar sesión
      </button>
    </div>
    );
    
};

export default Home;