import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface EtiquetaData{
    nombre: string;
}

export function useEtiquetas() { //listo
    return useQuery({
        queryKey: ['etiquetas'],
        queryFn: async () => {
            const respuesta = await api.get("api/v1/etiquetas");
            return respuesta.data;
        }
    });
}