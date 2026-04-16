import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../../services/api';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-usuario.html',
  styleUrls: ['./modal-usuario.scss']
})
export class ModalUsuarioComponent implements OnInit {

  readonly rolesDisponibles = [
    { value: 1, label: 'Administrador' },
    { value: 2, label: 'Nutricionista' },
    { value: 3, label: 'Usuario' },
  ];

  readonly generosDisponibles = [
    { value: 'femenino', label: 'Femenino' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'otro', label: 'Otro' },
  ];

  tiposDocumento: Array<{ id: number; name: string }> = [];

  @Input() usuarioEditar: any = null;
  @Input() errorMensaje: string | null = null;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  usuario = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    role_id: 3,
    document_type_id: null,
    document_number: '',
    gender: '',
    phone: '',
    password: '',
    status: 'ACTIVE'
  };

  modoEdicion = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarTiposDocumento();

    if (this.usuarioEditar) {
      this.usuario = {
        ...this.usuarioEditar,
        gender: this.usuarioEditar.gender ? String(this.usuarioEditar.gender).trim().toLowerCase() : '',
        password: '',
      };
      this.modoEdicion = true;
    }
  }

  cargarTiposDocumento() {
    this.apiService.getDocumentTypes().subscribe({
      next: (tipos: any) => {
        this.tiposDocumento = Array.isArray(tipos) ? tipos : [];
      },
      error: () => {
        this.tiposDocumento = [
          { id: 1, name: 'Cédula de Ciudadanía' },
          { id: 2, name: 'Tarjeta de Identidad' },
          { id: 3, name: 'Permiso de Permanencia' },
        ];
      }
    });
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  guardarUsuario() {
    this.guardar.emit(this.usuario);
  }
}


