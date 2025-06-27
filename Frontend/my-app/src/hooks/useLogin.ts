import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Logindata {
    correo: string;
    password: string;
}

interface AnonLoginData {
  type: string;
}

interface LoginData{
  token: string;
}

export function useLogin(onSuccess: (token: string)=> void, onFail:(error:string)=> void) {
    return useMutation<LoginData,AxiosError,Logindata>({
        mutationFn: async ({correo,password}: Logindata): Promise<LoginData> => {
            const respuesta = await api.post('api/v1/auth/Login', {correo,password});
            console.log(respuesta.data);
            return respuesta.data;
        },
        onSuccess: (data) => {
            console.log('Login exitoso', data);
            onSuccess(data.token);
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error xd';
            onFail(mensaje);
        }

    });
}

export function useAnonLogin(onSuccess: (token: string) => void, onFail: (error: string) => void) {
  return useMutation<LoginData, AxiosError, AnonLoginData>({
    mutationFn: async ({type}: AnonLoginData): Promise<LoginData> => {
      const respuesta = await api.post('api/v1/auth/anonimo');
      return respuesta.data;
    },
    onSuccess: (data) => {
      console.log('Sesión anónima creada', data);
      onSuccess(data.token);
    },
    onError: (error) => {
      const mensaje = (error.response?.data as { message?: string })?.message || 'Error al crear sesión anónima';
      onFail(mensaje);
    }
  });
}