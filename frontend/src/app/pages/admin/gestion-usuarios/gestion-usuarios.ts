import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalUsuarioComponent } from './components/modal-usuario/modal-usuario';
import { ApiService } from '../../../services/api';


@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalUsuarioComponent],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.scss']
})
export class GestionUsuariosComponent implements OnInit {

  filtroNombre: string = '';
  errorOperacion: string | null = null;

  usuarios: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.apiService.getUsers().subscribe({
      next: (response: any) => {
        const rawUsers = Array.isArray(response)
          ? response
          : response?.data || response?.users || [];

        this.usuarios = rawUsers.map((user: any) => ({
          ...user,
          id: user.id,
          nombre: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
          email: user.email,
          rol: this.obtenerNombreRol(user.role_id),
          estado: (user.status ?? '').toUpperCase() === 'ACTIVE' ? 1 : 0
        }));
      },
      error: (error) => {
        console.error('Error al cargar usuarios', error);
        this.usuarios = [];
      }
    });
  }

  get usuariosFiltrados() {
    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  cambiarEstado(usuario: any) {
    if (!usuario?.id) {
      return;
    }

    this.apiService.deleteUser(usuario.id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (error) => {
        console.error('Error al desactivar usuario', error);
      }
    });
  }

  mostrarModal = false;

  abrirModal(usuario: any = null) {
   this.errorOperacion = null;
   this.usuarioSeleccionado = usuario;
   this.mostrarModal = true;
  }
  
  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
    this.errorOperacion = null;
  }

  agregarUsuario(usuario: any) {
    if (this.usuarioSeleccionado?.id) {
      const payload = this.buildUpdatePayload(usuario);
      this.apiService.updateUser(this.usuarioSeleccionado.id, payload).subscribe({
        next: () => {
          this.usuarioSeleccionado = null;
          this.cargarUsuarios();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al actualizar usuario', error);
          this.errorOperacion = error?.error?.detail || 'No se pudo actualizar el usuario.';
        }
      });
      return;
    }

    const payload = this.buildCreatePayload(usuario);
    this.apiService.createUser(payload).subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cerrarModal();
      },
      error: (error) => {
        console.error('Error al crear usuario', error);
        this.errorOperacion = error?.error?.detail || 'No se pudo crear el usuario.';
      }
    });
  }

  private buildCreatePayload(usuario: any) {
    return {
      role_id: Number(usuario.role_id),
      document_type_id: Number(usuario.document_type_id),
      document_number: usuario.document_number,
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      gender: usuario.gender,
      phone: usuario.phone,
      password: usuario.password,
      email: usuario.email
    };
  }

  private buildUpdatePayload(usuario: any) {
    const payload: any = {
      role_id: Number(usuario.role_id),
      document_type_id: Number(usuario.document_type_id),
      document_number: usuario.document_number,
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      gender: usuario.gender,
      phone: usuario.phone,
      email: usuario.email,
      status: usuario.status
    };

    if (usuario.password) {
      payload.password = usuario.password;
    }

    return payload;
  }

  private obtenerNombreRol(roleId: any): string {
    const idNormalizado = Number(roleId);

    if (idNormalizado === 1) {
      return 'Administrador';
    }

    if (idNormalizado === 2) {
      return 'Nutricionista';
    }

    if (idNormalizado === 3) {
      return 'Usuario';
    }

    return roleId ? `Rol ${roleId}` : 'Sin rol';
  }


  usuarioSeleccionado: any = null;



}

