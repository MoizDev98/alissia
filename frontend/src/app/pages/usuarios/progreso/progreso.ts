import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RegistroPeso {
  fecha: string;
  peso: number;
}

@Component({
  selector: 'app-progreso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progreso.html',
  styleUrls: ['./progreso.scss']
})
export class ProgresoComponent {

  objetivoPeso = 65;

  historial: RegistroPeso[] = [
    { fecha: '2026-01-20', peso: 75 },
    { fecha: '2026-01-28', peso: 73 },
    { fecha: '2026-02-01', peso: 72 },
    { fecha: '2026-02-05', peso: 70.5 }
  ];

  get pesoActual(): number {
    return this.historial[this.historial.length - 1].peso;
  }

  get pesoInicial(): number {
    return this.historial[0].peso;
  }

  get progresoKg(): number {
    return this.pesoInicial - this.pesoActual;
  }

  get faltanteKg(): number {
    return this.pesoActual - this.objetivoPeso;
  }

  get progresoPorcentaje(): number {
    const total = this.pesoInicial - this.objetivoPeso;
    return Math.min(100, Math.max(0, (this.progresoKg / total) * 100));
  }

  get estado(): 'bien' | 'alerta' {
    return this.progresoKg > 0 ? 'bien' : 'alerta';
  }
}

