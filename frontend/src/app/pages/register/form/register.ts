import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class registerComponent {
  constructor(private apiService: ApiService, private router: Router) {}

  form = {
    first_name: '',
    last_name: '',
    email: '',
    age: null as number | null,
    phone: '',
    document_number: '',
    document_type_id: null as number | null,
    gender: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  };

  enviado = false;
  cargando = false;
  mensajeError = '';
  mensajeOk = '';

  validarSoloNumeros(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  campoInvalido(campo: keyof typeof this.form): boolean {
    if (!this.enviado) {
      return false;
    }

    if (campo === 'document_type_id') {
      return this.form.document_type_id === null;
    }

    if (campo === 'acceptTerms') {
      return !this.form.acceptTerms;
    }

    const value = this.form[campo];
    return value === null || value === '';
  }

  passwordsNoCoinciden(): boolean {
    if (!this.enviado) {
      return false;
    }
    return !!this.form.password && !!this.form.confirmPassword && this.form.password !== this.form.confirmPassword;
  }

  enviarFormulario() {
    if (this.cargando) {
      return;
    }

    this.enviado = true;
    this.mensajeError = '';
    this.mensajeOk = '';

    const faltanCampos =
      !this.form.first_name ||
      !this.form.last_name ||
      !this.form.email ||
      this.form.age === null ||
      !this.form.phone ||
      !this.form.document_number ||
      this.form.document_type_id === null ||
      !this.form.gender ||
      !this.form.password ||
      !this.form.confirmPassword ||
      !this.form.acceptTerms;

    if (faltanCampos) {
      this.mensajeError = 'Debes completar todos los campos obligatorios.';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.mensajeError = 'La contraseña y su confirmación no coinciden.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.mensajeError = 'Ingresa un correo electrónico válido.';
      return;
    }

    const age = this.form.age;
    if (age === null || age < 5 || age > 120) {
      this.mensajeError = 'La edad debe estar entre 5 y 120 años.';
      return;
    }

    if (this.form.password.length < 8) {
      this.mensajeError = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    const payload = {
      first_name: this.form.first_name.trim(),
      last_name: this.form.last_name.trim(),
      email: this.form.email.trim().toLowerCase(),
      age,
      phone: this.form.phone.trim(),
      document_type_id: Number(this.form.document_type_id),
      document_number: this.form.document_number.trim(),
      gender: this.form.gender,
      password: this.form.password,
      confirm_password: this.form.confirmPassword,
      accept_terms: this.form.acceptTerms,
    };

    this.cargando = true;

    this.apiService.publicRegister(payload).subscribe({
      next: () => {
        this.cargando = false;
        this.mensajeOk = 'Cuenta creada correctamente. Ahora puedes iniciar sesión.';
        this.mensajeError = '';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err?.error?.detail || 'No se pudo completar el registro.';
      },
    });
  }
}
