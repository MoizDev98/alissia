import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { PublicClientApplication } from '@azure/msal-browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000';
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID); 

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private msalConfig = {
    auth: {
      clientId: "7e7f855d-7451-4b60-b2bc-ef3f84b8ad0a",
      authority: "https://login.microsoftonline.com/1e9aabe8-67f8-4f1c-a329-a754e92499ae",
      redirectUri: "http://localhost:4200" 
      

    }
  };

  private msalInstance = new PublicClientApplication(this.msalConfig);

  constructor() {
    this.checkToken();
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarAzure();
    }
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
      this.msalInstance.logoutRedirect({
        postLogoutRedirectUri: "http://localhost:4200"
      });
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


  
  async iniciarAzure() {
    await this.msalInstance.initialize();

    try {
      const response = await this.msalInstance.handleRedirectPromise();

      if (response) {
        const cuenta = response.account;
        const claims = response.idTokenClaims as any;
        const azureRoles = claims.roles || []; 
        const nombreReal = claims.name || cuenta?.name || 'Usuario Unibarranquilla';

        let miRoleId = 3; 
        if (azureRoles.includes("Admin")) {
          miRoleId = 1;
        } else if (azureRoles.includes("Nutricionista")) {
          miRoleId = 2; 
        }

        const paqueteParaBackend = {
          nombre: nombreReal,
          email: cuenta?.username,
          role_id: miRoleId,
          token: response.idToken 
        };

        this.http.post(`${this.baseUrl}/sync-azure`, paqueteParaBackend).subscribe({
          next: (usuarioDesdeBaseDeDatos: any) => {
            
            usuarioDesdeBaseDeDatos.token = response.idToken;
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('kamoca_user', JSON.stringify(usuarioDesdeBaseDeDatos));
            }
            this.currentUserSubject.next(usuarioDesdeBaseDeDatos);
    
            if (usuarioDesdeBaseDeDatos.perfil_incompleto === true) {
              this.router.navigate(['/register/complete-profile']); 
            } else {
              if (usuarioDesdeBaseDeDatos.role_id === 1) {
                this.router.navigate(['/admin/home']); 
              } else if (usuarioDesdeBaseDeDatos.role_id === 2) {
                this.router.navigate(['nutricionista/home']); 
              } else {
                this.router.navigate(['usuarios/inicio']); 
              }
            }
          },
          error: (err) => {
            console.error("Error al sincronizar con el backend:", err);
          }
        });
      }
    } catch (error) {
      console.error("Error al procesar el regreso de Microsoft:", error);
    }
  }

  loginWithAzure() {
    this.msalInstance.loginRedirect({
      scopes: ["User.Read"]
    });
  }
}
