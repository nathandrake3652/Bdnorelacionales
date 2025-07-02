import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface PublicacionData{
    title: string;
    content: string;
    authorId: string;
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
        mutationFn: async (Rate:{userId: string, valor: number, publicacionId: string})  => {
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
        mutationFn: async (premioData:{userId: string, premioId: string, publicacionId: string})  => {
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

export function usePublicacionesUsuario(idUsuario: string) { 
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
        mutationFn: async (idPublicacion: string)  => {
            const respuesta = await api.patch('api/v1/publicaciones', idPublicacion);
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['publicaciones']});
            clienteQuery.invalidateQueries({queryKey:['publicacionesEtiqueta']});
        }
    });
}