import { useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { usePublicacionesPorEtiqueta, useCrearPublicacion, useVotarPublicacion, useDarPremio } from '../hooks/usePublicaciones';
import {useComentarios, useCrearComentario} from '../hooks/useComentarios';
import { useEtiquetas } from '../hooks/useTags';
import '../styles/Home.css';
import { usePremios } from '../hooks/usePremios';


interface ComentarioProps {
    comentario: any;
    profundidad?: number;
    user: any; // Pasar el objeto user como prop
    setComentarioEditando: React.Dispatch<React.SetStateAction<{
        publicacionId: string | null;
        tipo: 'publicacion' | 'comentario';
        content: string;
    }>>;
}

interface MediaItem {
  type: 'image' | 'video' | 'gif' | 'link' | 'text';
  content: string;
}

interface MediaDisplayProps {
  media: MediaItem[];
}

export const Home = () => {
    const { token, setToken } = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError } = useUserProfile();
    const queryClient = useQueryClient();
    const [filtro, setFiltro] = useState("Sin filtro");
    
    //estados para premios
    const [mostrarPremiosModal, setMostrarPremiosModal] = useState(false);
    const [publicacionSeleccionada, setPublicacionSeleccionada] = useState<string | null>(null);

    //Crear publicacion
    const [mostrarModal, setMostrarModal] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [tags, setTags] = useState("");
    const [imagenes, setImagenes] = useState<File[]>([]);
    const [videoUrl, setVideoUrl] = useState("");

    // Busqueda con etiquetas
    const [busquedaEtiqueta, setBusquedaEtiqueta] = useState("");
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState<string | null>(null);

    const [busquedaActiva, setBusquedaActiva] = useState(false);

    // cosas de comentarios
    const [comentarioEditando, setComentarioEditando] = useState<{
    publicacionId: string | null;
    tipo: 'publicacion' | 'comentario';
    content: string;
    }>({
    publicacionId: null,
    tipo: 'publicacion',
    content: ''
    });

    //hooks
    const etiquetaLimpia = etiquetaSeleccionada?.replace(/^#/, '') || '';
    const { data: publicacionesFiltradas } = usePublicacionesPorEtiqueta(
    busquedaActiva && etiquetaLimpia ? etiquetaLimpia : '',
    busquedaActiva && etiquetaLimpia ? filtro : 'Sin filtro'
    );

    const publicaciones = publicacionesFiltradas;


    const { data: etiquetas } = useEtiquetas();
    const { mutate: crearPublicacion } = useCrearPublicacion();
    const { mutate: votarPublicacion } = useVotarPublicacion();
    const { data: premios } = usePremios();
    const { mutate: crearComentario } = useCrearComentario();
    const { mutate: darPremio } = useDarPremio();
    
    // Estado que maneja votaciones
    const [userVotes, setUserVotes] = useState<Record<string, number>>({});

    // Filtrar etiquetas según la búsqueda
    const [comentariosAbiertos, setComentariosAbiertos] = useState<Record<string, boolean>>({});
    const etiquetasFiltradas = etiquetas?.filter((etiqueta: any) =>
    etiqueta.nombre?.toLowerCase().includes(busquedaEtiqueta.toLowerCase())
    ) || [];

    useEffect(() => {
        if (!token) {
            navigate('/Login');
        }
    }, [token, navigate]);

    if (cargauser) {
        return <div>Cargando...</div>;
    }
    
    if (isError) {
        setToken(null);
        navigate('/login');
        return null;
    }

    const logout = () => {
        setToken(null);
        sessionStorage.removeItem('token');
        navigate('/Login');
    };


    const handleCrearPublicacion = async () => {
        if (!titulo || !contenido) {
            alert("Título y contenido son requeridos");
            return;
        }

        const tagsArray = tags.split(' ').filter(tag => tag.startsWith('#')).map(tag => tag.substring(1));
        
        const formData = new FormData();
        formData.append('title', titulo);
        formData.append('content', contenido);
        formData.append('authorId', user.id);
        formData.append('tags', JSON.stringify(tagsArray));


        imagenes.forEach((imagen, index) => {
            formData.append(`imagenes`, imagen);
        });

        if (videoUrl) {
        formData.append('videoUrl', videoUrl);
        }

        try {
        const respuesta = await api.post('/publicacion', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        // Limpiar el formulario
        setTitulo("");
        setContenido("");
        setTags("");
        setImagenes([]);
        setVideoUrl("");
        setMostrarModal(false);
        
        // Actualizar la lista de publicaciones
        queryClient.invalidateQueries({queryKey:['publicaciones']});
        
        return respuesta.data;
    } catch (error) {
        console.error("Error al crear la publicación:", error);
        alert("Error al crear la publicación");
    }

        
    };

    const handleVote = (publicacionId: string, newVoteValue: number) => {
        if (user.type === 'anonimo') return;
        
        const currentVote = userVotes[publicacionId] || 0;
        let scoreChange = 0;
        
        
        if (currentVote === newVoteValue) {
            
            scoreChange = newVoteValue;
        } else if (currentVote === 0) {
            
            scoreChange = newVoteValue;
        } else {
            
            scoreChange = newVoteValue * 2; // Anula el voto anterior (+1 o -1) 
        }
        
        
        const newVote = currentVote === newVoteValue ? 0 : newVoteValue;
        setUserVotes(prev => ({
            ...prev,
            [publicacionId]: newVote
        }));
        
        // Enviar voto al backend
        console.log(publicacionId);
        votarPublicacion({
            idVotador: user.id,
            score: scoreChange,
            idPublicacion: publicacionId
        });
    };

    const handleSeleccionarPremio = (idPremio: string) => {
        if (!publicacionSeleccionada || !user) return;
        
        darPremio({
            userId: user.id,      
            premioId: idPremio,    
            publicacionId: publicacionSeleccionada
        });
        
        setMostrarPremiosModal(false);
    };

    const seleccionarEtiqueta = (etiqueta: string) => {
        const etiquetaFormateada = etiqueta.startsWith('#') ? etiqueta : `#${etiqueta}`;
        setEtiquetaSeleccionada(etiquetaFormateada);
        setBusquedaEtiqueta(etiquetaFormateada);
    };

    //comentarios
    const Comentario = ({ 
        comentario, 
        profundidad = 0, 
        user, 
        setComentarioEditando 
    }: ComentarioProps) => {
        const [mostrarRespuestas] = useState(false);
        const { data: respuestas } = useComentarios(comentario._id, 'comentario');
        
        return (
            <div className="comentario" style={{ marginLeft: `${profundidad * 20}px` }}>
                <div className="comentario-header">
                    <span>{comentario.author.username}</span>
                </div>
                
                <p className="comentario-content">{comentario.content}</p>
                
                

                {mostrarRespuestas && respuestas?.map((respuesta: any) => (
                    <Comentario 
                        key={respuesta._id} 
                        comentario={respuesta} 
                        profundidad={profundidad + 1}
                        user={user}
                        setComentarioEditando={setComentarioEditando}
                    />
                ))}
                {comentarioEditando.publicacionId === comentario._id && comentarioEditando.tipo === 'comentario' && (
                    <div className="comentario-form">
                        <textarea
                            value={comentarioEditando.content}
                            onChange={(e) => setComentarioEditando(prev => ({
                                ...prev,
                                content: e.target.value
                            }))}
                            placeholder="Escribe tu respuesta..."
                        />
                        <div className="comentario-form-actions">
                            <button 
                                onClick={handleCrearComentario}
                                disabled={!comentarioEditando.content.trim()}
                            >
                                Enviar
                            </button>
                            <button 
                                onClick={() => setComentarioEditando({
                                    publicacionId: null,
                                    tipo: 'comentario',
                                    content: ''
                                })}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };
    
        const handleCrearComentario = () => {
            if (!comentarioEditando.content.trim() || comentarioEditando.publicacionId === null) return;
            
            crearComentario({
                content: comentarioEditando.content,
                authorId: user.id,
                publicacionId: comentarioEditando.publicacionId,
                tipo: comentarioEditando.tipo
            });
            
            setComentarioEditando({
                publicacionId: null,
                tipo: 'publicacion',
                content: ''
            });
        };

    const ComentariosList = ({ publicacionId }: { publicacionId: string }) => {
        const { data: comentarios } = useComentarios(publicacionId, 'publicacion');
        
        return (
            <div className="comentarios-list">
                {comentarios?.map((comentario: any) => (
                    <Comentario 
                        key={comentario._id} 
                        comentario={comentario}
                        user={user}
                        setComentarioEditando={setComentarioEditando}
                    />
                ))}
            </div>
        );
    };

    const confirmarBusqueda = () => {
        if (!etiquetaSeleccionada && filtro === "Sin filtro") {
            
            setBusquedaActiva(false);
        } else {
            
            setBusquedaActiva(true);
        }
    };

    const limpiarBusqueda = () => {
        setBusquedaActiva(false);
        setEtiquetaSeleccionada(null);
        setFiltro("Sin filtro");
    };

    const MediaDisplay = ({ media }:MediaDisplayProps) => {
        if (!media?.length) return null;

        return (
            <div className="media-container">
            {media.map((item, index) => (
                item.type === 'image' && (
                <div key={index} className="media-item">
                    <img
                    src={`http://localhost:3000/uploads/${item.content}`} // Usa la URL completa que viene del backend
                    alt={`Imagen ${index}`}
                    onError={(e) => {
                        e.currentTarget.alt = 'Imagen no disponible';
                    }}
                    />
                </div>
                )
            ))}
            </div>
        );
        };

            // Función auxiliar para extraer el ID de YouTube
            function extractVideoId(url: string) {
                // YouTube
                const youtubeRegex = /(youtu\.be\/|youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/))([^?&"'>]+)/;
                const youtubeMatch = url.match(youtubeRegex);
                if (youtubeMatch && youtubeMatch[3].length === 11) return youtubeMatch[3];
                
                // Vimeo
                const vimeoRegex = /(vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
                const vimeoMatch = url.match(vimeoRegex);
                if (vimeoMatch) return vimeoMatch[2];
                
                return null;
            }

    return (
        <div className="home-container">
            <div className="header">
                {user.type === 'anonimo' ? (
                    <h2>Estás navegando como usuario anónimo</h2>
                ) : (
                    <div className="user-info">
                        <h2>Bienvenido, {user.username}</h2>
                        <button 
                            onClick={() => navigate('/PerfilUsuario')} 
                            className="notifications-btn"
                        >
                            Perfil
                        </button>
                        
                        <button onClick={logout} className="logout-btn">
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>

            {user.type !== 'anonimo' && (
                <button 
                    onClick={() => setMostrarModal(true)}
                    className="create-post-btn"
                >
                    Crear Publicación
                </button>
            )}

            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 className="modal-title">Nueva Publicación</h2>
                        
                        <div className="modal-field">
                            <label>Título:</label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                        </div>
                        
                        <div className="modal-field">
                            <label>Contenido:</label>
                            <textarea
                                value={contenido}
                                onChange={(e) => setContenido(e.target.value)}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Imágenes:</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setImagenes(Array.from(e.target.files));
                                    }
                                }}
                            />
                            {imagenes.length > 0 && (
                                <div>
                                    <p>Imágenes seleccionadas: {imagenes.length}</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-field">
                            <label>Enlace de video (YouTube, Vimeo, etc.):</label>
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>
                        
                        <div className="modal-field">
                            <label>Tags (separados por espacios, ej: #tag1 #tag2):</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                onClick={() => {
                                    setMostrarModal(false);
                                    setImagenes([]);
                                    setVideoUrl("");
                                }}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleCrearPublicacion}
                                className="submit-btn"
                            >
                                Publicar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="filter-container">
                <label>Filtrar publicaciones:</label>
                <select 
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                >
                    <option value="Sin filtro">Sin filtro</option>
                    <option value="recientes">Más recientes</option>
                    <option value="populares">Más populares</option>
                </select>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Ej: #react"
                    value={etiquetaSeleccionada || ''}
                    onChange={(e) => {
                    const value = e.target.value;
                    setEtiquetaSeleccionada(value.startsWith('#') ? value : `#${value}`);
                    }}
                />
                <button onClick={confirmarBusqueda}>
                    {busquedaActiva ? "Refrescar" : "Buscar"}
                </button>
                                
                {etiquetaSeleccionada && (
                    <div style={{ marginTop: '10px' }}>
                        <span>Filtrado por: {etiquetaSeleccionada} </span>
                        {busquedaActiva && (
                            <button onClick={limpiarBusqueda}>Limpiar</button>
                        )}
                    </div>
                )}

                {etiquetasFiltradas.map((etiqueta: {nombre: string, id?: number}) => (
                    <div 
                        key={etiqueta.nombre} 
                        className="tag-suggestion"
                        onClick={() => seleccionarEtiqueta(etiqueta.nombre)}
                    >
                        #{etiqueta.nombre}
                    </div>
                ))}
            </div>
            <div className="posts-list">
                {publicaciones?.map((publicacion: any) => (
                <div key={publicacion._id} className="post" style={{ position: 'relative' }}>
                    <div className="post-header">
                        <span className="post-author">{publicacion.author.username}</span>
                        <div>
                            {publicacion.tags?.map((tag: string) => (
                            <span 
                                key={tag} 
                                style={{
                                    marginLeft: '5px',
                                    background: '#e0e0e0',
                                    padding: '2px 5px',
                                    borderRadius: '3px',
                                    fontSize: '0.8rem'
                                }}
                                >
                                #{tag}
                            </span>
                            ))}
                        </div>
                    </div>
      
                
                    <h3 className="post-title">{publicacion.title}</h3>
                    <p className="post-content">{publicacion.content}</p>
                    <MediaDisplay media={publicacion.media || []} />

                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '15px'
                    }}>
                        
                        {user.type !== 'anonimo' ? (
                        <div className="voting-buttons">
                            <button
                                onClick={() => handleVote(publicacion._id, 1)}
                                className={`vote-btn upvote ${userVotes[publicacion._id] === 1 ? 'active' : ''}`}
                                disabled={userVotes[publicacion._id] === -1} 
                            >
                                ↑
                            </button>

                            <span className="score">{publicacion.score}</span>

                            <button
                                onClick={() => handleVote(publicacion._id, -1)}
                                className={`vote-btn downvote ${userVotes[publicacion._id] === -1 ? 'active' : ''}`}
                                disabled={userVotes[publicacion._id] === 1}
                            >
                                ↓
                            </button>
                        </div>
                        ) : (
                        <p>Puntuación: {publicacion.score}</p>
                        )}
                        
                        
                        {user.type !== 'anonimo' && (
                        <div className="premio-badge">
                            <button 
                            onClick={() => {
                                setPublicacionSeleccionada(publicacion._id);
                                setMostrarPremiosModal(true);
                            }}
                            className="premio-btn"
                            >
                            🏅
                            </button>
                            {publicacion.premios?.length > 0 && (
                            <span className="premio-count">
                                {publicacion.premios.length}
                            </span>
                            )}
                        </div>
                        )}
                    </div>

                    <div className="comentarios-section">
                        <div className="comentarios-controls">
                            <button 
                                onClick={() => setComentariosAbiertos(prev => ({
                                    ...prev,
                                    [publicacion._id]: !prev[publicacion._id]
                                }))}
                            >
                                {(comentariosAbiertos[publicacion._id] ?? false) ? 'Ocultar comentarios' : 'Ver comentarios'}
                            </button>

                            {user.type !== 'anonimo' && (
                                <button 
                                    onClick={() => setComentarioEditando({
                                        publicacionId: publicacion._id, // ID de la publicación
                                        tipo: 'publicacion',
                                        content: ''
                                    })}
                                >
                                    Añadir comentario
                                </button>
                            )}
                        </div>

                        {comentariosAbiertos[publicacion._id] && (
                            <ComentariosList publicacionId={publicacion._id} />
                        )}

                        {comentarioEditando.publicacionId === publicacion._id && (
                            <div className="comentario-form">
                                <textarea
                                    value={comentarioEditando.content}
                                    onChange={(e) => setComentarioEditando(prev => ({
                                        ...prev,
                                        content: e.target.value
                                    }))}
                                    placeholder="Escribe tu comentario..."
                                />
                                <div className="comentario-form-actions">
                                    <button 
                                        onClick={handleCrearComentario}
                                        disabled={!comentarioEditando.content.trim() || comentarioEditando.publicacionId === null}
                                    >
                                        Enviar
                                    </button>
                                    <button 
                                        onClick={() => setComentarioEditando({
                                            publicacionId: null,
                                            tipo: 'publicacion',
                                            content: ''
                                        })}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            
            {mostrarPremiosModal && (
            <div className="modal-overlay">
                <div className="modal-content" style={{ maxWidth: '400px' }}>
                <h2>Premiar publicación</h2>
                <p>Selecciona un premio:</p>
                
                <div className="premios-grid">
                    {premios?.map((premio: any, index: number) => {
                    const emojis = ['💡', '😂', '🔥', '😡'];
                    const yaPremiada = publicaciones
                        ?.find((p: any) => p._id === publicacionSeleccionada)
                        ?.premios
                        ?.some((p: any) => p.userId === user?.id && p.premioId === premio._id);
                    
                        return (
                            <button
                            key={premio._id}
                            onClick={() => handleSeleccionarPremio(premio._id)}
                            className="premio-option"
                            style={{
                                backgroundColor: yaPremiada ? '#e0e0e0' : 'transparent'
                            }}
                            >
                            <span className="premio-emoji">{emojis[index]}</span>
                            <span>{premio.name}</span>
                            {yaPremiada && <span>(Ya premiado)</span>}
                            </button>
                    );
                    })}
                </div>
                
                <div className="modal-actions">
                    <button 
                    onClick={() => setMostrarPremiosModal(false)}
                    className="cancel-btn"
                    >
                    Cancelar
                    </button>
                </div>
                </div>
            </div>
            )}


        </div>
    );
};

export default Home;