import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface ComentarioData{
    content: string;
    authorId: string;
    publicacionId: string;
    tipo: string;
}


export function useCrearComentario(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({content, authorId, publicacionId, tipo}:ComentarioData)  => {
            const respuesta = await api.post('comentario',{content, authorId, publicacionId, tipo});
            return respuesta.data
        },
        onSuccess: (_, variables) => {
            clienteQuery.invalidateQueries({
                queryKey:['comentarios', variables.publicacionId, variables.tipo]
            });
        }
    });
}

export function useVotarComentario() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (voteData: {comentarioId: string, idVotador: string, score: number}) => {
            const respuesta = await api.patch('comentario/votar', voteData);
            return respuesta.data;
        },
        onSuccess: (_, variables) => {
            // Invalida todas las queries de comentarios
            clienteQuery.invalidateQueries({queryKey: ['comentarios']});
            
            // Actualización optimista
            clienteQuery.setQueriesData(
                {queryKey: ['comentarios']},
                (oldData: any) => {
                    return oldData?.map((com: any) => {
                        if (com._id === variables.comentarioId) {
                            return {
                                ...com,
                                score: com.score + variables.score
                            };
                        }
                        return com;
                    });
                }
            );
        }
    });
}

export function useComentarios(publicacionId: string, tipo: string) {
    return useQuery({
        queryKey: ['comentarios', publicacionId, tipo],
        queryFn: async () => {
            const respuesta = await api.get(`/comentario`, { 
                params: {  
                    publicacionId,
                    filtro: tipo
                }
            });
            return respuesta.data;
        },
        select: (data) => {
            return data.map((com: any) => ({
                ...com,
                score: com.score || 0 // Asegura que siempre haya un score
            }));
        }
    });
}

export function useEliminarComentario(){ 
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (comentarioId: string)  => {
            const respuesta = await api.delete(`comentario/${comentarioId}`);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['publicaciones']});
        }
    });
}

export function useComentariosUsuario(userId: string) { 
    return useQuery({
        queryKey: ['comentariosUsuario', userId],
        queryFn: async () => {
            const respuesta = await api.get(`comentario/usuario/${userId}`);
            return respuesta.data;
        }
    });
}