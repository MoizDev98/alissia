import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service'; 

@Component({
  selector: 'app-completar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complete-profile.html',
  styleUrl: './complete-profile.scss' 
})
export class CompletarPerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8000'; 

  usuario: any = null;
  cargando: boolean = false;
  mensajeError: string = '';

  telefono: string = '';
  document_type_id: number | null = null;
  numero_documento: string = '';

  tiposDocumento: any[] = [];

  ngOnInit() {
    this.usuario = this.authService.getCurrentUser();
    
    if (!this.usuario) {
      this.router.navigate(['/login']);
    }

    this.cargarTiposDocumento();
  }

  cargarTiposDocumento() {
    this.http.get(`${this.baseUrl}/document-types`).subscribe({
      next: (tipos: any) => {
        this.tiposDocumento = tipos;
      },
      error: (err) => {
        console.error("No se pudieron cargar los tipos de documento", err);
        this.tiposDocumento = [
          { id: 1, name: 'Cédula de Ciudadanía' },
          { id: 2, name: 'Tarjeta de Identidad' }
        ];
      }
    });
  }

  guardarPerfil() {
    if (!this.telefono || !this.document_type_id || !this.numero_documento) {
      this.mensajeError = 'Por favor, llena todos los campos para continuar.';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    
    const datosActualizados = {
      phone: this.telefono,
      document_type_id: this.document_type_id,
      document_number: this.numero_documento.toString(),
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.usuario.token}`
    });

    this.http.put(`${this.baseUrl}/users/${this.usuario.id}`, datosActualizados, { headers }).subscribe({
      next: (res: any) => {
        this.cargando = false;
        
        this.usuario.perfil_incompleto = false;
        localStorage.setItem('kamoca_user', JSON.stringify(this.usuario));

        if (this.usuario.role_id === 1) {
          this.router.navigate(['/admin/home']); 
        } else if (this.usuario.role_id === 2) {
          this.router.navigate(['nutricionista/home']); 
        } else {
          this.router.navigate(['usuarios/inicio']); 
        }
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = 'Hubo un problema al guardar tus datos. Intenta de nuevo.';
      }
    });
  }
}