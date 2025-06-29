import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

interface EtiquetaData{
    nombre: string;
}

export function usePremios() { 
    return useQuery({
        queryKey: ['premios'],
        queryFn: async () => {
            const respuesta = await api.get("api/v1/premios");
            return respuesta.data;
        }
    });
}