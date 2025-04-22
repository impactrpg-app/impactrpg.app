import { ref } from "vue";
import { decode, JwtPayload } from "jsonwebtoken";
import { ImageUploadResponse } from "@impact/shared";

export type Claims = JwtPayload & {
  displayName: string;
  email: string;
};

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
export const accessToken = ref<string | null>(
  localStorage.getItem("accessToken")
);

export function getUserClaims(): Claims | null {
  if (!accessToken.value) {
    return null;
  }
  const decoded = decode(accessToken.value);
  if (!decoded || typeof decoded === "string") {
    return null;
  }
  return decoded as Claims;
}

export function login(token: string) {
  accessToken.value = token;
  localStorage.setItem("accessToken", token);
}

export function logout() {
  accessToken.value = null;
  localStorage.removeItem("accessToken");
  window.location.href = "/";
}

export function getHeaders(): HeadersInit {
  if (!accessToken.value) {
    return {
      "Content-Type": "application/json",
    };
  }
  return {
    Authorization: `Bearer ${accessToken.value}`,
    "Content-Type": "application/json",
  };
}

export function getSocketHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken.value}`,
  };
}

export async function makeRequest<T>(
  path: string,
  options: RequestInit = {},
  nonJsonRequest = false
): Promise<T> {
  let headers = getHeaders();
  if (nonJsonRequest) {
    headers = {
      Authorization: `Bearer ${accessToken.value}`,
    };
  }
  const response = await fetch(`${API_URL}${path}`, {
    headers,
    ...options,
  });

  if (response.status === 401) {
    logout();
    throw new Error("Authorization error");
  }

  if (response.status >= 300) {
    throw new Error(
      `API responded with ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function uploadFile(path: string, blob: Uint8Array) {
  const formData = new FormData();
  formData.append("file", new Blob([blob]));
  const resp = await fetch(API_URL + path, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  });
  if (!resp.ok) {
    return;
  }
  const data: ImageUploadResponse = await resp.json();
  return data;
}
