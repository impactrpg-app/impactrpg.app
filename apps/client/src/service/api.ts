import { ref } from "vue";
import { decode, JwtPayload } from 'jsonwebtoken';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
export const accessToken = ref<string | null>(
    localStorage.getItem('accessToken')
);

export function getUserClaims(): JwtPayload | null {
    if (!accessToken.value) {
        return null;
    }
    const decoded = decode(accessToken.value);
    if (!decoded || typeof decoded === 'string') {
        return null;
    }
    return decoded;
}

export function login(token: string) {
    accessToken.value = token;
    localStorage.setItem('accessToken', token);
}

export function logout() {
    accessToken.value = null;
    localStorage.removeItem('accessToken');
    window.location.href = '/';
}

export function getHeaders(): HeadersInit {
    if (!accessToken.value) {
        return {
            'Content-Type': 'application/json',
        };
    }
    return {
        'Authorization': `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json',
    }
}

export function getSocketHeaders(): Record<string, string> {
    return {
        'Authorization': `Bearer ${accessToken.value}`
    }
}