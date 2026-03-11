import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class loginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  correo: string = '';
  clave: string = '';
  
  cargando: boolean = false;
  mensajeError: string = '';

  iniciarSesion() {
    if (!this.correo || !this.clave) {
      this.mensajeError = 'Por favor llena todos los campos.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    this.authService.login({ email: this.correo, password: this.clave }).subscribe({
      next: (usuario) => {
        this.cargando = false; 

        if (usuario.role_id === 1) {
          this.router.navigate(['/admin/home']); 
        } else if(usuario.role_id === 2) {
          
          this.router.navigate(['nutricionista/home']); 
        } else {
          this.router.navigate(['usuarios/inicio']); 
        }
      },
      error: (err) => {
        this.mensajeError = 'Correo o contraseña incorrectos.';
        this.cargando = false;
      }
    });
  }

  iniciarSesionAzure() {
    this.cargando = true;
    this.authService.loginWithAzure();
  }
}