import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PatientProfile, SavedPlan } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private http = inject(HttpClient);
  
  private baseUrl = 'http://localhost:8000'; 

  constructor() { }

  
  saveProfile(profile: PatientProfile): Observable<any> {
    return this.http.post(`${this.baseUrl}/profiles`, profile);
  }

  
  getProfile(userId: number): Observable<PatientProfile> {
    return this.http.get<PatientProfile>(`${this.baseUrl}/profiles/${userId}`);
  }

  
  saveDietPlan(plan: SavedPlan): Observable<any> {
    return this.http.post(`${this.baseUrl}/plans`, plan);
  }
}