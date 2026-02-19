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
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    role_id: null,
    document_type_id: null,
    document_number: '',
    gender: '',
    phone: '',
    password: '',
    status: 'ACTIVE'
  };

  modoEdicion = false;

  ngOnInit() {
    if (this.usuarioEditar) {
      this.usuario = { ...this.usuarioEditar, password: '' };
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


