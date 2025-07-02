import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';


export function useNotificaciones(userId: string) {

    return useQuery({
        queryKey: ['notificaciones', userId],
        queryFn: async () => {
            const respuesta = await api.get(`comentario/${userId}`);
            return respuesta.data;
        }
    });
}