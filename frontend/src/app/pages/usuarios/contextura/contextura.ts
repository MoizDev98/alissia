import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ContexturaService } from '../../../services/contextura';

@Component({
  selector: 'app-contextura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contextura.html',
  styleUrl: './contextura.scss',
})
export class ContexturaComponent {
  private contexturaService = inject(ContexturaService);

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  cargando = false;
  error = '';

  resultado: {
    contextura: string;
    ratio: number;
    confianza?: number;
    cobertura_frame?: number;
    warnings?: string[];
    modelo_usado?: string;
    bounding_box: { x1: number; y1: number; x2: number; y2: number };
  } | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.error = '';
    this.resultado = null;
    this.selectedFile = file;

    if (!file) {
      this.previewUrl = null;
      return;
    }

    this.previewUrl = URL.createObjectURL(file);
  }

  analizar(): void {
    if (!this.selectedFile) {
      this.error = 'Selecciona una imagen antes de analizar.';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.resultado = null;

    this.contexturaService.analizarContextura(this.selectedFile).subscribe({
      next: (resp) => {
        this.resultado = resp;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err?.error?.detail || 'No se pudo procesar la imagen.';
        this.cargando = false;
      }
    });
  }

}
