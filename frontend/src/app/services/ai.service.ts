import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientProfile } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000/';

  constructor() { }

  generarDieta(datosPaciente: any): Observable<any> {
    
    return this.http.post(`${this.baseUrl}generar-dieta`, datosPaciente);
    
  }
}