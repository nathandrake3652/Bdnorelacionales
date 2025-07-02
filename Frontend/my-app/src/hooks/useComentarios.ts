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
            const respuesta = await api.post('api/v1/comentario',{content, authorId, publicacionId, tipo});
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
        mutationFn: async (voteData: {idVotador: string, score: number, idComentario: string}) => {
            const respuesta = await api.patch('api/v1/comentario/votar', voteData);
            return respuesta.data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey: ['comentarios']});
        }
    });
}

export function useComentarios(publicacionId: string, filtro: string) {
    return useQuery({
        queryKey: ['comentarios', publicacionId, filtro],
        queryFn: async () => {
            const respuesta = await api.get(`api/v1/comentario/${filtro}/${publicacionId}`);
            return respuesta.data;
        }
    });
}

export function useEliminarComentario(){ 
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (idComentario: string)  => {
            const respuesta = await api.patch(`api/v1/comentario/${idComentario}`);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['publicaciones']});
        }
    });
}

export function useComentariosUsuario(idUser: string) { 
    return useQuery({
        queryKey: ['comentariosUsuario', idUser],
        queryFn: async () => {
            const respuesta = await api.get(`api/v1/comentario/user/${idUser}`);
            return respuesta.data;
        }
    });
}