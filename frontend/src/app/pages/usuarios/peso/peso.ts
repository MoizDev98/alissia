import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RegistroPeso {
  fecha: string;
  peso: number;
}

@Component({
  selector: 'app-peso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './peso.html',
  styleUrls: ['./peso.scss']
})
export class PesoComponent {

  pesoActual: number = 70; // peso inicial simulado
  nuevoPeso: number | null = null;

  historial: RegistroPeso[] = [
    { fecha: '2026-02-01', peso: 71 },
    { fecha: '2026-02-05', peso: 70.5 }
  ];

  registrarPeso() {
    if (this.nuevoPeso === null || this.nuevoPeso <= 0) return;

    // evitar duplicado
    if (this.nuevoPeso === this.pesoActual) return;

    const hoy = new Date().toISOString().split('T')[0];

    this.historial.unshift({
      fecha: hoy,
      peso: this.nuevoPeso
    });

    this.pesoActual = this.nuevoPeso;
    this.nuevoPeso = null;
  }

  diferenciaConAnterior(): number {
    if (this.historial.length < 2) return 0;
    return this.historial[0].peso - this.historial[1].peso;
  }

  get tendencia(): 'sube' | 'baja' | 'igual' {
    const diff = this.diferenciaConAnterior();
    if (diff > 0) return 'sube';
    if (diff < 0) return 'baja';
    return 'igual';
  }
}
