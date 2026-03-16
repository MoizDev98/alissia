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

  guardarTodo() {
    if (!this.peso || !this.altura || !this.edad || !this.genero || !this.objetivoSeleccionado) {
      alert("Por favor completa tus medidas y elige un objetivo principal.");
      return;
    }

    if (!this.usuarioActual) {
      alert("Error: No has iniciado sesión.");
      return;
    }

    this.cargando = true;

    const metaParaLaIA = `Quiero ${this.objetivoSeleccionado} de peso. Ritmo: ${this.ritmoSeleccionado || 'normal'}. Preferencias: ${this.preferenciasSeleccionadas.join(', ') || 'Ninguna'}`;

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
        alert("Hubo un error al guardar tus datos.");
        this.cargando = false;
      }
    });
  }
}