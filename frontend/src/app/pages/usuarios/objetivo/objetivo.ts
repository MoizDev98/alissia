import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import { ContexturaService } from '../../../services/contextura';
import { PatientProfile } from '../../../models/data.model';

@Component({
  selector: 'app-objetivo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './objetivo.html',
  styleUrls: ['./objetivo.scss']
})
export class ObjetivoComponent implements OnInit {

  
  private authService = inject(AuthService);
  private dataService = inject(DataService);
  private contexturaService = inject(ContexturaService);
  private router = inject(Router);

  usuarioActual: any = null;
  cargando = false;

  // Estado del panel de análisis por foto (Path A)
  mostrarPanelFoto = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  analisisLoading = false;
  analisisError: string | null = null;
  analisisResult: any = null;

  peso: number | null = null;
  altura: number | null = null;
  edad: number | null = null;
  genero: string = '';
  submitError: string | null = null;
  fieldErrors: { peso?: string; altura?: string; edad?: string; genero?: string; objetivo?: string } = {};

  ngOnInit() {
    this.usuarioActual = this.authService.getCurrentUser();
  }

  objetivoSeleccionado: 'bajar' | 'mantener' | 'subir' | null = null;
  seleccionarObjetivo(valor: 'bajar' | 'mantener' | 'subir') { this.objetivoSeleccionado = valor; }

  ritmoSeleccionado: 'lento' | 'moderado' | 'rapido' | null = null;
  seleccionarRitmo(valor: 'lento' | 'moderado' | 'rapido') { this.ritmoSeleccionado = valor; }

  preferenciasSeleccionadas: string[] = [];
  togglePreferencia(preferencia: string) {
    if (this.preferenciasSeleccionadas.includes(preferencia)) {
      this.preferenciasSeleccionadas = this.preferenciasSeleccionadas.filter(p => p !== preferencia);
    } else {
      this.preferenciasSeleccionadas.push(preferencia);
    }
  }

  togglePanelFoto() {
    this.mostrarPanelFoto = !this.mostrarPanelFoto;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.selectedFile = file;
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = URL.createObjectURL(file);
    this.analisisResult = null;
    this.analisisError = null;
  }

  analizarFoto() {
    if (!this.selectedFile) return;
    this.analisisLoading = true;
    this.analisisError = null;
    this.analisisResult = null;
    this.contexturaService.analizarContextura(this.selectedFile).subscribe({
      next: (res) => {
        this.analisisResult = res;
        this.analisisLoading = false;
      },
      error: (err) => {
        this.analisisError = err.error?.detail || 'No se pudo analizar la imagen. Intenta con otra foto.';
        this.analisisLoading = false;
      }
    });
  }

  descartarFoto() {
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = null;
    this.selectedFile = null;
    this.analisisResult = null;
    this.analisisError = null;
  }

  private validarDatosParaDieta(): string | null {
    this.fieldErrors = {};

    if (!this.peso || this.peso < 30 || this.peso > 350) {
      this.fieldErrors.peso = 'Rango permitido: 30 a 350 kg.';
      return 'El peso debe estar entre 30 y 350 kg.';
    }

    if (!this.altura || this.altura < 120 || this.altura > 230) {
      this.fieldErrors.altura = 'Rango permitido: 120 a 230 cm.';
      return 'La altura debe estar entre 120 y 230 cm.';
    }

    if (!this.edad || this.edad < 12 || this.edad > 100) {
      this.fieldErrors.edad = 'Rango permitido: 12 a 100 años.';
      return 'La edad debe estar entre 12 y 100 años.';
    }

    const generoNormalizado = (this.genero || '').trim().toLowerCase();
    const generosValidos = new Set(['femenino', 'masculino']);
    if (!generosValidos.has(generoNormalizado)) {
      this.fieldErrors.genero = 'Selecciona Femenino o Masculino.';
      return 'Debes seleccionar un género válido.';
    }

    return null;
  }

  guardarTodo() {
    this.submitError = null;

    if (!this.peso || !this.altura || !this.edad || !this.genero || !this.objetivoSeleccionado) {
      this.submitError = 'Completa tus medidas y elige un objetivo principal.';
      return;
    }

    const errorValidacion = this.validarDatosParaDieta();
    if (errorValidacion) {
      this.submitError = errorValidacion;
      return;
    }

    if (!this.usuarioActual) {
      this.submitError = 'No has iniciado sesión.';
      return;
    }

    this.cargando = true;

    const metaParaLaIA = `Quiero ${this.objetivoSeleccionado} de peso. Ritmo: ${this.ritmoSeleccionado || 'normal'}. Preferencias: ${this.preferenciasSeleccionadas.join(', ') || 'Ninguna'}`;

    if (metaParaLaIA.length < 3 || metaParaLaIA.length > 250) {
      this.fieldErrors.objetivo = 'El objetivo generado excede el límite permitido.';
      this.submitError = 'El objetivo generado excede el límite permitido. Reduce tus preferencias o ajusta el texto.';
      return;
    }

    const perfilParaGuardar: PatientProfile = {
      user_id: this.usuarioActual.id,
      weight: this.peso,
      height: this.altura,
      age: this.edad,
      gender: this.genero,
      activity_level: 'Moderado',
      goal: metaParaLaIA,
      ...(this.analisisResult?.contextura && { contextura: this.analisisResult.contextura })
    };

    this.dataService.saveProfile(perfilParaGuardar).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['usuarios/recomendaciones']);
      },
      error: (err) => {
        console.error(err);
        this.submitError = err?.error?.detail || 'Hubo un error al guardar tus datos.';
        this.cargando = false;
      }
    });
  }
}