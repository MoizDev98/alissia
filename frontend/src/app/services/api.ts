import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const userJson = localStorage.getItem('kamoca_user');
    if (userJson) {
      const usuario = JSON.parse(userJson);
      if (usuario.token) {
        return new HttpHeaders({
          'Authorization': `Bearer ${usuario.token}`
        });
      }
    }
    return new HttpHeaders();
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`, { headers: this.getAuthHeaders() });
  }

  createUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, payload, { headers: this.getAuthHeaders() });
  }

  publicRegister(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/public/register`, payload);
  }

  updateUser(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, payload, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`, { headers: this.getAuthHeaders() });
  }
}