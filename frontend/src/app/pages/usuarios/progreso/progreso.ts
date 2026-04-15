import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import type { Chart as ChartType } from 'chart.js';

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
export class ProgresoComponent implements OnInit, AfterViewInit, OnDestroy {

  private authService = inject(AuthService);
  private dataService = inject(DataService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('pesoChartCanvas') pesoChartCanvas?: ElementRef<HTMLCanvasElement>;

  private chart?: ChartType;

  objetivoPeso = 65;
  cargando = true;
  errorVisual = '';

  historial: RegistroPeso[] = [];

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  ngOnInit(): void {
    this.cargarHistorialPeso();
  }

  private cargarHistorialPeso(): void {
    const usuarioActual = this.authService.getCurrentUser();

    if (!usuarioActual?.id) {
      this.errorVisual = 'No se pudo identificar al usuario para cargar el progreso.';
      this.cargando = false;
      return;
    }

    this.dataService.getWeightHistory(usuarioActual.id, 30).subscribe({
      next: (registros) => {
        const lista = Array.isArray(registros) ? registros : [];

        this.historial = lista
          .map((item: any) => ({
            fecha: String(item?.measured_at ?? '').slice(0, 10),
            peso: Number(item?.weight ?? 0)
          }))
          .filter((item: RegistroPeso) => !!item.fecha && item.peso > 0)
          .reverse();

        this.errorVisual = '';

        this.cargando = false;
        this.cdr.detectChanges();
        this.renderChart();
      },
      error: () => {
        this.errorVisual = 'No se pudo cargar el historial de peso desde la base de datos.';
        this.cargando = false;
        this.cdr.detectChanges();
        this.renderChart();
      }
    });
  }

  private async renderChart(): Promise<void> {
    if (!this.pesoChartCanvas?.nativeElement) return;

    this.chart?.destroy();

    if (!this.historial.length) return;

    const labels = this.historial.map((item) => item.fecha);
    const data = this.historial.map((item) => item.peso);

    const { default: Chart } = await import('chart.js/auto');

    this.chart = new Chart(this.pesoChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Peso (kg)',
            data,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.parsed.y} kg`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 0,
              autoSkip: true
            },
            grid: {
              color: 'rgba(15, 95, 74, 0.08)'
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(15, 95, 74, 0.08)'
            }
          }
        }
      }
    });
  }

  get pesoActual(): number {
    if (!this.historial.length) return 0;
    return this.historial[this.historial.length - 1].peso;
  }

  get pesoInicial(): number {
    if (!this.historial.length) return 0;
    return this.historial[0].peso;
  }

  get variacionKg(): number {
    if (!this.historial.length) return 0;
    return this.pesoActual - this.pesoInicial;
  }

  get variacionAbsKg(): number {
    return Math.abs(this.variacionKg);
  }

  get tendenciaPeso(): 'subio' | 'bajo' | 'igual' {
    if (this.variacionKg > 0) return 'subio';
    if (this.variacionKg < 0) return 'bajo';
    return 'igual';
  }

  get progresoKg(): number {
    if (!this.historial.length) return 0;
    return this.pesoInicial - this.pesoActual;
  }

  get faltanteKg(): number {
    if (!this.historial.length) return 0;
    return Math.max(0, this.pesoActual - this.objetivoPeso);
  }

  get progresoPorcentaje(): number {
    if (!this.historial.length) return 0;
    const total = this.pesoInicial - this.objetivoPeso;
    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, (this.progresoKg / total) * 100));
  }

  get estado(): 'bien' | 'alerta' {
    return this.tendenciaPeso === 'bajo' ? 'bien' : 'alerta';
  }
}

