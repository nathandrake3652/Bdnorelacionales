import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface PublicacionData{
    title: string;
    content: string;
    authorId: number;
    tags: string[];
    score: number;
}

export function useCrearPublicacion(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({title, content,authorId, tags, score}:PublicacionData)  => {
            const respuesta = await api.post('api/v1/publicaciones',{title, content, authorId, tags, score});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['publicaciones']});
        }
    });
}

export function useVotarPublicacion(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (Rate:{score: number, idPublicacion: number})  => {
            const respuesta = await api.patch('api/v1/publicaciones',Rate);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['publicaciones']});
        }
    });
}

export function useDarPremio(){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (premioData:{idPublicacion: number, idPremio: number})  => {
            const respuesta = await api.patch('api/v1/publicaciones', premioData);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['publicaciones']});
        }
    });
}

export function usePublicaciones() {
    return useQuery({
        queryKey: ['publicaciones'],
        queryFn: async () => {
            const respuesta = await api.get('api/v1/publicaciones');
            return respuesta.data;
        }
    });
}

export function usePublicacionesPorEtiqueta(Datos:{etiqueta: string, filtro: string}) {
    return useQuery({
        queryKey: ['publicaciones', Datos],
        queryFn: async (Datos) => {
            const respuesta = await api.get('api/v1/publicaciones', Datos);
            return respuesta.data;
        }
    });
}

