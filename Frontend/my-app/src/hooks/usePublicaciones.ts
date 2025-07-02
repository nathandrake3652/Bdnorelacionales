import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface PublicacionData{
    title: string;
    content: string;
    authorId: number;
    tags: string[];
}

export function useCrearPublicacion(){ //listo
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({title, content,authorId, tags}:PublicacionData)  => {
            const respuesta = await api.post('api/v1/publicaciones',{title, content, authorId, tags});
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['publicaciones']});
        }
    });
}

export function useVotarPublicacion(){ //listo
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (Rate:{idVotador: number, score: number, idPublicacion: number})  => {
            const respuesta = await api.patch('api/v1/publicaciones',Rate);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['publicaciones']});
            clienteQuery.invalidateQueries({queryKey:['publicacionesEtiqueta']});
        }
    });
}

export function useDarPremio(){ // listo
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (premioData:{idPremiador: number, idPublicacion: number, idPremio: number})  => {
            const respuesta = await api.patch('api/v1/publicaciones', premioData);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['publicaciones']});
        }
    });
}

export function usePublicaciones(filtro: string) { //listo
    return useQuery({
        queryKey: ['publicaciones'],
        queryFn: async () => {
            const respuesta = await api.get(`api/v1/publicaciones/${filtro}`);
            return respuesta.data;
        }
    });
}

export function usePublicacionesUsuario(idUsuario: number) { 
    return useQuery({
        queryKey: ['publicacionesUsuario'],
        queryFn: async () => {
            const respuesta = await api.get(`api/v1/publicaciones/user/${idUsuario}`);
            return respuesta.data;
        }
    });
}

export function usePublicacionesPorEtiqueta(etiqueta: string, filtro: string) { //listo
    return useQuery({
        queryKey: ['publicacionesEtiqueta'],
        queryFn: async (Datos) => {
            const respuesta = await api.get(`api/v1/publicaciones/${etiqueta}/${filtro}`);
            return respuesta.data;
        }
    });
}

export function useEliminarPublicacion(){ 
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (idPublicacion: number)  => {
            const respuesta = await api.patch('api/v1/publicaciones', idPublicacion);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['publicaciones']});
            clienteQuery.invalidateQueries({queryKey:['publicacionesEtiqueta']});
        }
    });
}