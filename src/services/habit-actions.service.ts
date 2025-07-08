import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IHabits } from '../mocks/dumbHabits';

@Injectable({
  providedIn: 'root',
})
export class HabitActionsService {
  private _habitos = new BehaviorSubject<IHabits[]>([]);
  habitos$ = this._habitos.asObservable();

  private apiUrl = 'http://127.0.0.1:8000/api/habitos/';

  constructor(private http: HttpClient) {}

  /** Retorna headers com token JWT */
  private getHeaders(): HttpHeaders {
  let token = '';
  
  // Verifica se está no navegador antes de acessar localStorage
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access') || '';
  }
  console.log('Token atual:', token);

  return new HttpHeaders({
    Authorization: `Bearer ${token}`, 
    'Content-Type': 'application/json',
  });
  }


  /** Buscar hábitos do usuário autenticado */
  fetchHabits(): void {
    this.http.get<IHabits[]>(this.apiUrl, { headers: this.getHeaders() })
      .subscribe({
        next: (data) => this._habitos.next(data),
        error: (err) => console.error('Erro ao buscar hábitos:', err),
      });
  }

  /** Criar hábito no backend */
  createHabit(payload: any): Observable<any> {
    console.log('Enviando hábito:', payload);
    console.log('Token usado:', localStorage.getItem('access'));
    return this.http.post(this.apiUrl, payload, {
      headers: this.getHeaders(),
    });
  }

  /** Remover hábito via backend */
  remove(habito: IHabits): void {
    const url = `${this.apiUrl}${habito.id}/`;
    this.http.delete(url, { headers: this.getHeaders() }).subscribe({
      next: () => {
        const atual = this._habitos.getValue();
        const filtrado = atual.filter(h => h.id !== habito.id);
        this._habitos.next(filtrado);
      },
      error: (err) => {
        console.error('Erro ao excluir hábito:', err);
      },
    });
  }
  /** Marcar hábito como feito */
marcarComoFeito(habitoId: number, dia: string): Observable<any> {
  const token = localStorage.getItem('access');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });

  const url = `http://127.0.0.1:8000/api/habitos/${habitoId}/feito/`;
  return this.http.post(url, { dia }, { headers });
}

getHabitsDoneThisWeek(): Observable<any[]> {
  return this.http.get<any[]>('http://localhost:8000/api/registros/');
}



}
