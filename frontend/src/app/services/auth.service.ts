import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // <-- 1. Herramienta para saber dónde estamos
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000';

  private platformId = inject(PLATFORM_ID); 

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkToken(); 
  }

  private checkToken() {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('kamoca_user');
      if (userJson) {
        this.currentUserSubject.next(JSON.parse(userJson));
      }
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((user: any) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('kamoca_user', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('kamoca_user');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser() {
    const currentUser = this.currentUserSubject.value;

    if (currentUser) {
      return currentUser;
    }

    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('kamoca_user');
      if (userJson) {
        try {
          const parsedUser = JSON.parse(userJson);
          this.currentUserSubject.next(parsedUser);
          return parsedUser;
        } catch {
          localStorage.removeItem('kamoca_user');
        }
      }
    }

    return null;
  }
}