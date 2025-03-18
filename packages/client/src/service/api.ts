import { ref } from "vue";

export const API_URL = 'http://localhost:3000'; //'https://api.dev.impactrpg.app';
export const SOCKET_URL = 'http://localhost:3001'; //'https://socket.dev.impactrpg.app';
export const accessToken = ref<string | null>(
    localStorage.getItem('accessToken')
);

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