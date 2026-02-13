import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-usuario.html',
  styleUrls: ['./modal-usuario.scss']
})
export class ModalUsuarioComponent implements OnInit {

  @Input() usuarioEditar: any = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  usuario = {
    nombre: '',
    email: '',
    rol: 'Usuario',
    estado: 1
  };

  modoEdicion = false;

  ngOnInit() {
    if (this.usuarioEditar) {
      this.usuario = { ...this.usuarioEditar };
      this.modoEdicion = true;
    }
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  guardarUsuario() {
    this.guardar.emit(this.usuario);
    this.cerrarModal();
  }
}


