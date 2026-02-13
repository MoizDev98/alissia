import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalUsuarioComponent } from './components/modal-usuario/modal-usuario';


@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalUsuarioComponent],
  templateUrl: './gestion-usuarios.html',
  styleUrls: ['./gestion-usuarios.scss']
})
export class GestionUsuariosComponent {

  filtroNombre: string = '';

  usuarios = [
    { id: 1, nombre: 'Carlos Ruiz', email: 'carlos@mail.com', rol: 'Usuario', estado: 1 },
    { id: 2, nombre: 'Ana López', email: 'ana@mail.com', rol: 'Nutricionista', estado: 1 },
    { id: 3, nombre: 'Pedro Gómez', email: 'pedro@mail.com', rol: 'Usuario', estado: 0 }
  ];

  get usuariosFiltrados() {
    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  cambiarEstado(usuario: any) {
    usuario.estado = usuario.estado === 1 ? 0 : 1;
  }

  mostrarModal = false;

  abrirModal(usuario: any = null) {
    this.usuarioSeleccionado = usuario;
    this.mostrarModal = true;
  }


  cerrarModal() {
    this.mostrarModal = false;
  }

  agregarUsuario(usuario: any) {

    if (this.usuarioSeleccionado) {
      // EDITAR
      const index = this.usuarios.findIndex(u => u.email === this.usuarioSeleccionado.email);
      this.usuarios[index] = usuario;
    } else {
      // CREAR
      this.usuarios.push(usuario);
    }

    this.usuarioSeleccionado = null;
  }


  usuarioSeleccionado: any = null;



}

