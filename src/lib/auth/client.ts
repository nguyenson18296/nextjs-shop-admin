'use client';
import type { User } from '@/types/user';
import { BASE_URL } from '@/utils/constants';
import { type DataResponseBase } from '@/types/common';

interface LoginResponse extends DataResponseBase {
  data: User
  access_token: string;
}

interface UserResponse extends LoginResponse {}

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string; success?: boolean }> {
    // Make API request
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: LoginResponse = await response.json();
    if (data.success) {
      const token = data.access_token;
      localStorage.setItem('custom-auth-token', token);
      return {
        error: '',
        success: false,
      }
    } 
      return {
        success: false,
        error: 'Mật khẩu hoặc email không đúng. Xin thử lại!'
      };
    
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: UserResponse['data'] | null; error?: string }> {
    // Make API request
    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token') || '';
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: UserResponse = await response.json();
    if (data.success) {
      return { data: data.data };
    }

    return { data: null };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
