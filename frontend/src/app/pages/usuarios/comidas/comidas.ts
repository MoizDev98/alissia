import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { AuthService } from '../../../services/auth.service';

interface ComidaItem {
  tipo: 'Desayuno' | 'Almuerzo' | 'Cena';
  mealType: 'desayuno' | 'almuerzo' | 'cena';
  plan: string;
  calorias: number;
  planId: number | null;
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
  guardando = false;
  errorVisual = '';
  exitoVisual = '';

  comidas: ComidaItem[] = [
    {
      tipo: 'Desayuno',
      mealType: 'desayuno',
      plan: 'Dieta sin generar',
      calorias: 0,
      planId: null,
      estado: null, // null | 'cumplida' | 'no-cumplida'
      registro: ''
    },
    {
      tipo: 'Almuerzo',
      mealType: 'almuerzo',
      plan: 'Dieta sin generar',
      calorias: 0,
      planId: null,
      estado: null,
      registro: ''
    },
    {
      tipo: 'Cena',
      mealType: 'cena',
      plan: 'Dieta sin generar',
      calorias: 0,
      planId: null,
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
          this.asignarMetaPlan(dieta, latest?.plan_id ?? null);
          this.cargarRegistrosDelDia();
          return;
        }

        this.cargarPlanDesdePlanes();
      },
      error: () => {
        this.cargarPlanDesdePlanes();
      }
    });
  }

  private cargarPlanDesdePlanes() {
    if (!this.usuarioId) return;

    this.dataService.getUserPlans(this.usuarioId).subscribe({
      next: (plans) => {
        const latestPlan = plans?.[0];
        const dieta = latestPlan?.plan_data;

        if (dieta) {
          this.comidas[0].plan = dieta.desayuno || 'Dieta sin generar';
          this.comidas[1].plan = dieta.almuerzo || 'Dieta sin generar';
          this.comidas[2].plan = dieta.cena || 'Dieta sin generar';
          this.asignarMetaPlan(dieta, latestPlan?.id ?? null);
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

    this.dataService.getTodayMeals(this.usuarioId, this.getTodayLocalDate()).subscribe({
      next: (logs) => {
        const byType: Record<string, any> = {};
        for (const log of logs || []) {
          byType[log.meal_type] = log;
        }

        for (const comida of this.comidas) {
          const key = comida.mealType;
          const row = byType[key];
          if (!row) {
            comida.estado = null;
            comida.registro = '';
            continue;
          }

          comida.estado = row.status === 'completed' ? 'cumplida' : row.status === 'skipped' ? 'no-cumplida' : null;
          comida.registro = row.consumed_text || '';
          if (row.estimated_calories !== null && row.estimated_calories !== undefined) {
            comida.calorias = Number(row.estimated_calories) || comida.calorias;
          }
          if (row.plan_id !== null && row.plan_id !== undefined) {
            comida.planId = Number(row.plan_id) || comida.planId;
          }
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

    this.errorVisual = '';
    this.exitoVisual = '';
    this.guardando = true;

    const status = comida.estado === 'cumplida' ? 'completed' : comida.estado === 'no-cumplida' ? 'skipped' : 'planned';

    this.dataService.saveMealLog({
      user_id: this.usuarioId,
      meal_type: comida.mealType,
      status,
      meal_date: this.getTodayLocalDate(),
      planned_text: comida.plan,
      consumed_text: comida.registro || null,
      estimated_calories: comida.calorias || null,
      plan_id: comida.planId,
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.exitoVisual = `Se guardó ${comida.tipo.toLowerCase()} correctamente.`;
        this.cargarRegistrosDelDia();
      },
      error: (err) => {
        this.guardando = false;
        this.errorVisual = err?.error?.detail || 'No se pudo guardar el estado de la comida.';
      }
    });
  }

  onRegistroBlur(comida: any) {
    if (comida.estado === 'no-cumplida') {
      this.onEstadoChange(comida);
    }
  }

  private getTodayLocalDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private asignarMetaPlan(dieta: any, planId: number | null) {
    const totalCalorias = Number(dieta?.calorias_totales ?? 0);

    const desayunoCal = totalCalorias > 0 ? Math.round(totalCalorias * 0.3) : 0;
    const almuerzoCal = totalCalorias > 0 ? Math.round(totalCalorias * 0.4) : 0;
    const cenaCal = totalCalorias > 0 ? Math.max(totalCalorias - desayunoCal - almuerzoCal, 0) : 0;

    this.comidas[0].calorias = desayunoCal;
    this.comidas[1].calorias = almuerzoCal;
    this.comidas[2].calorias = cenaCal;

    for (const comida of this.comidas) {
      comida.planId = planId;
    }
  }

}
