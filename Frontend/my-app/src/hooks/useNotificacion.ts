import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import api from '../api/axios';

<<<<<<< Updated upstream
<<<<<<< Updated upstream
export function useNotificaciones(UserId: number) {
=======
export function useNotificaciones(userId: string) {
>>>>>>> Stashed changes
=======
export function useNotificaciones(userId: string) {
>>>>>>> Stashed changes
    return useQuery({
        queryKey: ['notificaciones', userId],
        queryFn: async () => {
            const respuesta = await api.get(`api/v1/comentario/${userId}`);
            return respuesta.data;
        }
    });
}