import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';



export function usePremios() { 
    return useQuery({
        queryKey: ['premios'],
        queryFn: async () => {
            const respuesta = await api.get('/premio');
            return respuesta.data;
        }
    });
}