import api from '@/api/api';
import { components } from '@/types/api';


export const login = async (phone_number: string, password: string) => {
    const response = await api.post('/auth/login', { phone_number, password });
    return response.data;
};

export const refreshAccessToken = async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken: refreshToken });
    return response.data;
};

export const getUserInfo = async (id: number) => {
    const response = await api.get('/user/id/' + id);
    return response.data;
};

export const authMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

type CreateUserDto = components['schemas']['CreateUserDto'];
export const register = async (data: CreateUserDto) => {
    const response = await api.post('/auth/register', data);
    return response.data;
}
