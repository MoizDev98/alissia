import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
    const platformId = inject(PLATFORM_ID);
    
    let peticionClonada = req;

    if (isPlatformBrowser(platformId)) {
    const userJson = localStorage.getItem('kamoca_user');
    
    if (userJson) {
      const usuario = JSON.parse(userJson);
      
      if (usuario.token) {
        peticionClonada = req.clone({
          setHeaders: {
            Authorization: `Bearer ${usuario.token}`
          }
        });
      }
    }
  }
  
  return next(peticionClonada);
};