import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Registerdata
{
    username: string;
    correo: string;
    password: string;
    type: string;
}

interface Registerresponse
{
    message: string;
}

export function useRegister(onSuccess: () => void, onFail:(error:string)=>void) {
    return useMutation<Registerresponse,AxiosError,Registerdata>({
        mutationFn: async ({username, correo, password, type}:Registerdata): Promise<Registerresponse> => {
            const respuesta = await api.post('api/v1/auth/register',{username, correo, password, type});
            return respuesta.data;
        },
        onSuccess: () => {
            onSuccess();
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error...';
            onFail(mensaje);
        }
    })
}