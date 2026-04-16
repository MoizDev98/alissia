import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

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
export class PesoComponent implements OnInit {

  private dataService = inject(DataService);
  private authService = inject(AuthService);

  usuarioId: number | null = null;

  pesoActual: number = 0;
  nuevoPeso: number | null = null;

  historial: RegistroPeso[] = [];

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.usuarioId = user?.id ?? null;
    if (!this.usuarioId) return;
    this.cargarPesoReal();
  }

  private cargarPesoReal() {
    if (!this.usuarioId) return;

    this.dataService.getWeightHistory(this.usuarioId, 30).subscribe({
      next: (rows) => {
        this.historial = (rows || []).map((item: any) => ({
          fecha: this.formatearFechaLocal(item?.measured_at),
          peso: Number(item.weight)
        }));

        this.pesoActual = this.historial.length > 0 ? this.historial[0].peso : 0;
      },
      error: () => {
        this.historial = [];
        this.pesoActual = 0;
      }
    });
  }

  private formatearFechaLocal(valorFecha: string): string {
    if (!valorFecha) return '';
    const fecha = new Date(valorFecha);
    if (Number.isNaN(fecha.getTime())) {
      return String(valorFecha).slice(0, 10);
    }

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get ultimaFechaRegistro(): string {
    if (!this.historial.length) return 'Sin registros';
    return this.historial[0].fecha;
  }

  registrarPeso() {
    if (this.nuevoPeso === null || this.nuevoPeso <= 0) return;
    if (!this.usuarioId) return;

    // evitar duplicado
    if (this.nuevoPeso === this.pesoActual) return;

    this.dataService.registerWeight({
      user_id: this.usuarioId,
      weight: this.nuevoPeso,
      source: 'manual'
    }).subscribe({
      next: () => {
        this.nuevoPeso = null;
        this.cargarPesoReal();
      }
    });
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
