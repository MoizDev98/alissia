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

  getRecommendationHistory(userId: number, limit: number = 20): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recommendations/history/${userId}?limit=${limit}`);
  }

  generateAutoRecommendation(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/recommendations/auto/${userId}`, {});
  }

  getTodayMeals(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/meals/${userId}/today`);
  }

  saveMealLog(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/meals`, payload);
  }

  getLatestWeight(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/weights/${userId}/latest`);
  }

  getWeightHistory(userId: number, limit: number = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/weights/${userId}?limit=${limit}`);
  }

  registerWeight(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/weights`, payload);
  }
}