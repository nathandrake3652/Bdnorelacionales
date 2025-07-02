import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { usePublicaciones, usePublicacionesPorEtiqueta, useCrearPublicacion, useVotarPublicacion, useDarPremio } from '../hooks/usePublicaciones';
import {useComentarios, useCrearComentario, useVotarComentario} from '../hooks/useComentarios';
import { useEtiquetas } from '../hooks/useTags';
import '../styles/Home.css';
import { usePremios } from '../hooks/usePremios';

export const Home = () => {
    const { token, setToken } = useAuth();
    const navigate = useNavigate();
    const { data: user, isLoading: cargauser, isError } = useUserProfile();
    
    const [filtro, setFiltro] = useState({
        filtro: "Sin filtro" 
    });

    //estados para premios
    const [mostrarPremiosModal, setMostrarPremiosModal] = useState(false);
    const [publicacionSeleccionada, setPublicacionSeleccionada] = useState<string | null>(null);

    //Crear publicacion
    const [mostrarModal, setMostrarModal] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [tags, setTags] = useState("");

    // Busqueda con etiquetas
    const [busquedaEtiqueta, setBusquedaEtiqueta] = useState("");
    const [etiquetaSeleccionada, setEtiquetaSeleccionada] = useState<string | null>(null);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    
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
    const { data: publicaciones, isLoading: cargandoPublicaciones } = 
    etiquetaSeleccionada 
        ? usePublicacionesPorEtiqueta(etiquetaSeleccionada, filtro.filtro)
        : usePublicaciones(filtro.filtro);
    
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

    if (cargauser || cargandoPublicaciones) {
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
            tags: tagsArray
        });

        setTitulo("");
        setContenido("");
        setTags("");
        setMostrarModal(false);
    };

    const handleVote = (publicacionId: string, newVoteValue: number) => {
        if (user.type === 'anonimo') return;
        
        const currentVote = userVotes[publicacionId] || 0;
        let scoreChange = 0;
        
        if (currentVote === newVoteValue) {
            scoreChange = -newVoteValue;
        } 
        
        else if (currentVote === 0) {
            scoreChange = newVoteValue;
        }
        
        else {
            scoreChange = newVoteValue; // (1 o -1)
        }
        
        const newVote = currentVote === newVoteValue ? 0 : newVoteValue;
        setUserVotes(prev => ({
            ...prev,
            [publicacionId]: newVote
        }));
        
        votarPublicacion({
            idVotador: user.id,
            score: scoreChange,
            idPublicacion: publicacionId
        });
    };

    const handleSeleccionarPremio = (idPremio: string) => {
        if (!publicacionSeleccionada || !user) return;
        
        darPremio({
            idPremiador: user.id,
            idPublicacion: publicacionSeleccionada,
            idPremio: idPremio
        });
        
        setMostrarPremiosModal(false);
    };

    const seleccionarEtiqueta = (etiqueta: string) => {
        setEtiquetaSeleccionada(etiqueta);
        setBusquedaEtiqueta(etiqueta);
        setMostrarSugerencias(false);
    };

    const limpiarFiltroEtiqueta = () => {
        setEtiquetaSeleccionada(null);
        setBusquedaEtiqueta("");
    };

    //comentarios
    const Comentario = ({ comentario, profundidad = 0 }: { comentario: any, profundidad?: number }) => {
        const { mutate: votarComentario } = useVotarComentario();
        const [mostrarRespuestas, setMostrarRespuestas] = useState(false);
        const { data: respuestas } = useComentarios(comentario.id, 'comentario');
    
        // Estado para manejar los votos
        const [userVotes, setUserVotes] = useState<Record<string, number>>({});

            const handleVoteComentario = (comentarioId: string, newVoteValue: number) => {
                    if (user.type === 'anonimo') return;
                    
                    const currentVote = userVotes[comentarioId] || 0;
                    let scoreChange = 0;
                    
                    if (currentVote === newVoteValue) {
                        scoreChange = -newVoteValue;
                    } else if (currentVote === 0) {
                        scoreChange = newVoteValue;
                    } else {
                        scoreChange = newVoteValue; // (1 o -1)
                    }
                    
                    const newVote = currentVote === newVoteValue ? 0 : newVoteValue;
                    setUserVotes(prev => ({
                        ...prev,
                        [comentarioId]: newVote
                    }));
                    
                    votarComentario({
                        idVotador: user.id,
                        score: scoreChange,
                        idComentario: comentarioId
                    });
                };

            return (
                <div className="comentario" style={{ marginLeft: `${profundidad * 20}px` }}>
                    <div className="comentario-header">
                        <span>{comentario.author}</span>
                        <div className="comentario-votos">
                            <button 
                                onClick={() => handleVoteComentario(comentario.id, 1)}
                                className={userVotes[comentario.id] === 1 ? 'active' : ''}
                                disabled={user.type === 'anonimo'}
                            >↑</button>
                            <span>{comentario.score}</span>
                            <button 
                                onClick={() => handleVoteComentario(comentario.id, -1)}
                                className={userVotes[comentario.id] === -1 ? 'active' : ''}
                                disabled={user.type === 'anonimo'}
                            >↓</button>
                        </div>
                    </div>
                    <p className="comentario-content">{comentario.content}</p>
                    
                    <div className="comentario-actions">
                        {user.type !== 'anonimo' && (
                            <button 
                                onClick={() => setComentarioEditando({
                                    publicacionId: comentario.id,
                                    tipo: 'comentario',
                                    content: ''
                                })}
                            >
                                Responder
                            </button>
                        )}
                        
                        {respuestas?.length > 0 && (
                            <button onClick={() => setMostrarRespuestas(!mostrarRespuestas)}>
                                {mostrarRespuestas ? 'Ocultar respuestas' : `Ver respuestas (${respuestas.length})`}
                            </button>
                        )}
                    </div>

                    {mostrarRespuestas && respuestas?.map((respuesta: any) => (
                        <Comentario 
                            key={respuesta.id} 
                            comentario={respuesta} 
                            profundidad={profundidad + 1}
                        />
                    ))}
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
                    <Comentario key={comentario.id} comentario={comentario} />
                ))}
            </div>
        );
    };

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
                            <label>Tags (separados por espacios, ej: #tag1 #tag2):</label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                            />
                        </div>
                        
                        <div className="modal-actions">
                            <button 
                                onClick={() => setMostrarModal(false)}
                                className="cancel-btn"
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
                    className="filter-select"
                    value={filtro.filtro}
                    onChange={handleFiltroChange}
                >
                    <option value="Sin filtro">Sin filtro</option>
                    <option value="Puntuación (Mayor a Menor)">Puntuación (Mayor a Menor)</option>
                    <option value="Puntuación (Menor a Mayor)">Puntuación (Menor a Mayor)</option>
                    <option value="Más recientes">Más recientes</option>
                </select>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar etiquetas..."
                    value={busquedaEtiqueta}
                    onChange={(e) => {
                        setBusquedaEtiqueta(e.target.value);
                        setMostrarSugerencias(true);
                    }}
                    onFocus={() => setMostrarSugerencias(true)}
                />
                
                {etiquetaSeleccionada && (
                    <div style={{ marginTop: '10px' }}>
                        <span>Filtrado por: {etiquetaSeleccionada} </span>
                        <button 
                            onClick={limpiarFiltroEtiqueta}
                            style={{ 
                                marginLeft: '10px',
                                padding: '2px 5px',
                                background: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer'
                            }}
                        >
                            x
                        </button>
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
                <div key={publicacion.id} className="post" style={{ position: 'relative' }}>
                    <div className="post-header">
                        <span className="post-author">{publicacion.author}</span>
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
      
                    
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '15px'
                    }}>
                        
                        {user.type !== 'anonimo' ? (
                        <div className="voting-buttons">
                            <button
                            onClick={() => handleVote(publicacion.id, 1)}
                            className={`vote-btn upvote ${userVotes[publicacion.id] === 1 ? 'active' : ''}`}
                            disabled={cargandoPublicaciones}
                            >
                            ↑
                            </button>
                            
                            <span className="score">{publicacion.score}</span>
                            
                            <button
                            onClick={() => handleVote(publicacion.id, -1)}
                            className={`vote-btn downvote ${userVotes[publicacion.id] === -1 ? 'active' : ''}`}
                            disabled={cargandoPublicaciones}
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
                                setPublicacionSeleccionada(publicacion.id);
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
                                    [publicacion.id]: !prev[publicacion.id]
                                }))}
                            >
                                {(comentariosAbiertos[publicacion.id] ?? false) ? 'Ocultar comentarios' : 'Ver comentarios'}
                            </button>

                            {user.type !== 'anonimo' && (
                                <button 
                                    onClick={() => setComentarioEditando({
                                        publicacionId: publicacion.id, // ID de la publicación
                                        tipo: 'publicacion',
                                        content: ''
                                    })}
                                >
                                    Añadir comentario
                                </button>
                            )}
                        </div>

                        {comentariosAbiertos[publicacion.id] && (
                            <ComentariosList publicacionId={publicacion.id} />
                        )}

                        {comentarioEditando.publicacionId === publicacion.id && (
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
                    const yaPremiada = (publicaciones as Array<{id: string, premios?: Array<{idPremiador: string, id: string}>}> | undefined)
                        ?.find(p => p.id === publicacionSeleccionada)
                        ?.premios
                        ?.some((p: {idPremiador: string, id: string}) => p.idPremiador === user?.id && p.id === premio.id);
                    
                        return (
                            <button
                            key={premio.id}
                            onClick={() => handleSeleccionarPremio(premio.id)}
                            className="premio-option"
                            style={{
                                backgroundColor: yaPremiada ? '#e0e0e0' : 'transparent'
                            }}
                            >
                            <span className="premio-emoji">{emojis[index]}</span>
                            <span>{premio.nombre}</span>
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