import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

interface ComidaItem {
  tipo: 'Desayuno' | 'Almuerzo' | 'Cena';
  plan: string;
  calorias: number;
  estado: 'cumplida' | 'no-cumplida' | null;
  registro: string;
}

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comidas.html',
  styleUrls: ['./comidas.scss']
})
export class ComidasComponent implements OnInit {

  private dataService = inject(DataService);
  private authService = inject(AuthService);

  usuarioId: number | null = null;
  cargando = false;

  comidas: ComidaItem[] = [
    {
      tipo: 'Desayuno',
      plan: 'Dieta sin generar',
      calorias: 0,
      estado: null, // null | 'cumplida' | 'no-cumplida'
      registro: ''
    },
    {
      tipo: 'Almuerzo',
      plan: 'Dieta sin generar',
      calorias: 0,
      estado: null,
      registro: ''
    },
    {
      tipo: 'Cena',
      plan: 'Dieta sin generar',
      calorias: 0,
      estado: null,
      registro: ''
    }
  ];

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.usuarioId = user?.id ?? null;
    if (!this.usuarioId) return;

    this.cargando = true;
    this.cargarPlanDesdeIA();
  }

  private cargarPlanDesdeIA() {
    if (!this.usuarioId) return;

    this.dataService.getRecommendationHistory(this.usuarioId, 1).subscribe({
      next: (history) => {
        const latest = history?.[0];
        const dieta = latest?.ai_response;

        if (dieta) {
          this.comidas[0].plan = dieta.desayuno || 'Dieta sin generar';
          this.comidas[1].plan = dieta.almuerzo || 'Dieta sin generar';
          this.comidas[2].plan = dieta.cena || 'Dieta sin generar';
        }

        this.cargarRegistrosDelDia();
      },
      error: () => {
        this.cargarRegistrosDelDia();
      }
    });
  }

  private cargarRegistrosDelDia() {
    if (!this.usuarioId) return;

    this.dataService.getTodayMeals(this.usuarioId).subscribe({
      next: (logs) => {
        const byType: Record<string, any> = {};
        for (const log of logs || []) {
          byType[log.meal_type] = log;
        }

        for (const comida of this.comidas) {
          const key = comida.tipo.toLowerCase();
          const row = byType[key];
          if (!row) {
            comida.estado = null;
            comida.registro = '';
            continue;
          }

          comida.estado = row.status === 'completed' ? 'cumplida' : row.status === 'skipped' ? 'no-cumplida' : null;
          comida.registro = row.consumed_text || '';
        }

        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  onEstadoChange(comida: any) {
    if (!this.usuarioId) return;

    const status = comida.estado === 'cumplida' ? 'completed' : comida.estado === 'no-cumplida' ? 'skipped' : 'planned';

    this.dataService.saveMealLog({
      user_id: this.usuarioId,
      meal_type: comida.tipo.toLowerCase(),
      status,
      planned_text: comida.plan,
      consumed_text: comida.registro || null,
    }).subscribe();
  }

  onRegistroBlur(comida: any) {
    if (comida.estado === 'no-cumplida') {
      this.onEstadoChange(comida);
    }
  }

}
