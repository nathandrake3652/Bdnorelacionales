import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

export function useNotificaciones(UserId: number) {
    return useQuery({
        queryKey: ['notificaciones', UserId],
        queryFn: async () => {
            const respuesta = await api.get(`api/v1/comentario/${UserId}`);
            return respuesta.data;
        }
    });
}