// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginPayload {
  // Pode usar username ou email para login
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = 'http://127.0.0.1:8000/auth';

  constructor(private http: HttpClient) {}

  login(data: LoginPayload): Observable<any> {
    return this.http.post(`${this.API}/jwt/create/`, data);
  }

  register(data: RegisterPayload): Observable<any> {
    return this.http.post(`${this.API}/users/`, data);
  }
}
