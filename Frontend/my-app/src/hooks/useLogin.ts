import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Logindata {
    username: string;
    password: string;
}



export function useLogin(onSuccess: (token: string)=> void, onFail:(error:string)=> void) {
    return useMutation<string,AxiosError,Logindata>({
        mutationFn: async ({username,password}: Logindata): Promise<string> => {
            const respuesta = await api.post('api/v1/auth/Login', {username,password});
            console.log(respuesta.data);
            return respuesta.data;
        },
        onSuccess: (data) => {
            console.log('Login exitoso', data);
            onSuccess(data);
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error xd';
            onFail(mensaje);
        }

    });
}