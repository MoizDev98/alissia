import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContexturaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000';

  analizarContextura(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.baseUrl}/contextura`, formData);
  }
}
