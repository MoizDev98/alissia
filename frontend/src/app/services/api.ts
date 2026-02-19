import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/users`);
  }

  createUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, payload);
  }

  updateUser(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, payload);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }
}
