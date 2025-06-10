import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface ComentarioData{
    content: string;
    score: number;
    authorId: number;
    publicacionId: number;
}

export function useCrearComentario(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({content, score,authorId, publicacionId}:ComentarioData)  => {
            const respuesta = await api.post('api/v1/comentario',{content, score, authorId, publicacionId});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['comentarios']});
        }
    });
}

export function useVotarComentario(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (Rate:{score: number, idComentario: number})  => {
            const respuesta = await api.patch('api/v1/comentario',Rate);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['comentarios']});
        }
    });
}

export function useComentarios(publicacionId: number) {
    return useQuery({
        queryKey: ['comentarios', publicacionId],
        queryFn: async () => {
            const respuesta = await api.get(`api/v1/comentario/${publicacionId}`);
            return respuesta.data;
        }
    });
}