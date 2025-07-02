import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import {useNavigate} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { usePublicacionesUsuario, useEliminarPublicacion } from '../hooks/usePublicaciones';
import { useComentariosUsuario, useEliminarComentario } from '../hooks/useComentarios';
import '../styles/Perfil.css';

export const PerfilUsuario = () => {
    
    const {token, setToken} = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError} = useUserProfile();
    const [activeTab, setActiveTab] = useState<'publicaciones' | 'comentarios'>('publicaciones');


    const { data: publicaciones, refetch: refetchPublicaciones } = usePublicacionesUsuario(user?._id || '');
    const { data: comentarios, refetch: refetchComentarios } = useComentariosUsuario(user?._id || '');

    const { mutate: eliminarPublicacion } = useEliminarPublicacion();
    const { mutate: eliminarComentario } = useEliminarComentario();

    useEffect(() => {
        if (!token) {
            navigate('/Login');
        }
    }, [token, navigate]);

    
    useEffect(() => {
        if (isError) {
            setToken(null);
            navigate('/login');
        }
    }, [isError, setToken, navigate]);
    
    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token');
        navigate('/Login');
    }

    const handleEliminarPublicacion = (_id: string) => {
        if (window.confirm('¿Estás seguro de eliminar esta publicación?')) {
            eliminarPublicacion(_id, {
                onSuccess: () => {
                    refetchPublicaciones();
                }
            });
        }
    };

    const handleEliminarComentario = (_id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este comentario?')) {
            eliminarComentario(_id, {
                onSuccess: () => {
                    refetchComentarios();
                }
            });
        }
    };


    if(cargauser || !user)
    {
        return <div> Cargando... </div>;
    }
    

    return (
    <div className="profile-container">
            
            <div className="profile-header">
                <h1>{user.username}</h1>
                <button onClick={() => navigate('/Notificaciones')} className="notifications-btn"> Notificaciones </button>
                <button onClick={logout} className="logout-btn">Cerrar sesión</button>
            </div>
            
            
            <div className="profile-tabs">
                <button
                    className={`tab-button ${activeTab === 'publicaciones' ? 'active' : ''}`}
                    onClick={() => setActiveTab('publicaciones')}
                >
                    Publicaciones
                </button>
                <button
                    className={`tab-button ${activeTab === 'comentarios' ? 'active' : ''}`}
                    onClick={() => setActiveTab('comentarios')}
                >
                    Comentarios
                </button>
            </div>
            
            <div className="profile-content">
                {activeTab === 'publicaciones' ? (
                    <div className="publicaciones-section">
                        {publicaciones?.length ? (
                            [...publicaciones]
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map(publicacion => (
                                <div key={publicacion._id} className="publicacion-card">
                                    <h3>{publicacion.title}</h3>
                                    <p>{publicacion.content}</p>
                                    <div className="post-meta">
                                        <span>Likes: {publicacion.votos?.reduce((sum: any, voto: any) => sum + voto.score, 0) || 0}</span>
                                        <span>{new Date(publicacion.createdAt).toLocaleDateString()}</span>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleEliminarPublicacion(publicacion._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay publicaciones para mostrar</p>
                        )}
                    </div>
                ) : (
                    <div className="comentarios-section">
                        {comentarios?.length ? (
                            [...comentarios]
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map(comentario => (
                                <div key={comentario._id} className="comentario-card">
                                    <p>{comentario.content}</p>
                                    <div className="comment-meta">
                                        <span>En: {comentario.publicacionTitle || 'Publicación eliminada'}</span>
                                        <span>Likes: {comentario.votos?.reduce((sum :any, voto : any) => sum + voto.score, 0) || 0}</span>
                                        <span>{new Date(comentario.createdAt).toLocaleDateString()}</span>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleEliminarComentario(comentario._id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No hay comentarios para mostrar</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default PerfilUsuario;