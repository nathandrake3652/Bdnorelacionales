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
        {user.type !== 'anonimo' && (
            <button 
                onClick={() => setMostrarModal(true)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 15px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Crear Publicación
            </button>
        )}
            
        {mostrarModal && (
            <div style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    width: '80%',
                    maxWidth: '500px'
                }}>
                    <h2>Nueva Publicación</h2>
                        
                    <div style={{ marginBottom: '15px' }}>
                        <label>Título:</label>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                        
                    <div style={{ marginBottom: '15px' }}>
                        <label>Contenido:</label>
                        <textarea
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            style={{ width: '100%', padding: '8px', minHeight: '100px' }}
                        />
                    </div>
                        
                    <div style={{ marginBottom: '15px' }}>
                        <label>Tags (separados por espacios, ej: #tag1 #tag2):</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>
                        
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button 
                            onClick={() => setMostrarModal(false)}
                            style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white' }}
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleCrearPublicacion}
                            style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white' }}
                        >
                            Publicar
                        </button>
                    </div>
                </div>
            </div>
        )}

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