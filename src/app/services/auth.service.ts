import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface LoginPayload {
  username?: string;
  email?: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  re_password: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = 'http://127.0.0.1:8000/auth';

  constructor(private http: HttpClient) {}

  /** Realiza login e salva os tokens no localStorage */
  login(data: LoginPayload): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.API}/jwt/create/`, data).pipe(
      tap((res) => {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
        console.log('Tokens salvos:', res.access);
        
      })
    );
  }

  /** Cadastra um novo usuário */
  register(data: RegisterPayload): Observable<any> {
    return this.http.post(`${this.API}/users/`, data);
  }

  /** Remove tokens do armazenamento local */
  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  /** Retorna o token atual de acesso */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
    }
    return null;
  }
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);

      return payload.user_id || null;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
}

  /** Retorna true se o usuário estiver autenticado */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
