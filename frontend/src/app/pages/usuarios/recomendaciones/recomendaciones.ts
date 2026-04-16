import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendaciones.html',
  styleUrls: ['./recomendaciones.scss']
})
export class RecomendacionesComponent implements OnInit {

  private authService = inject(AuthService);
  private dataService = inject(DataService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  cargando = true;
  resumenIA: string = '';
  recomendaciones: string[] = [];
  nivelConfianza: number = 0;
  caloriasTotales: number = 0;
  errorVisual: string = '';

  ngOnInit(): void {
    this.iniciarMagia();
  }

  iniciarMagia() {
    const usuarioActual = this.authService.getCurrentUser();

    if (!usuarioActual) {
      console.warn("Debes iniciar sesión primero.");
      this.router.navigate(['/login']);
      return;
    }

    this.dataService.getProfile(usuarioActual.id).subscribe({
      next: (history) => {
        if (!history) {
          this.router.navigate(['/usuarios/objetivo']);
          this.cargando = false;
          return;
        }

        this.generarYGuardarRecomendacion(usuarioActual.id);
      },
      error: () => {
        this.router.navigate(['/usuarios/objetivo']);
        this.cargando = false;
      }
    });
  }

  private generarYGuardarRecomendacion(userId: number) {
    this.dataService.generateAutoRecommendation(userId).pipe(
      timeout(120000)
    ).subscribe({
      next: (response) => {
        this.errorVisual = '';
        const dieta = this.normalizarRespuestaIA(response?.dieta ?? response);

        if (!this.esDietaValida(dieta)) {
          this.errorVisual = 'La IA respondió un plan incompleto. Intenta nuevamente.';
          this.resumenIA = 'No se pudo generar la dieta en un formato válido.';
          this.cargando = false;
          this.cdr.detectChanges();
          return;
        }

        this.aplicarDietaEnVista(dieta);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('La IA falló', err);
        if (err?.name === 'TimeoutError' || err?.message?.includes('timeout')) {
          this.errorVisual = '⏱️ La IA se está tardando demasiado. Intenta nuevamente en unos segundos.';
          this.resumenIA = 'Tiempo de espera agotado.';
        } else if (err?.status === 400) {
          this.errorVisual = err?.error?.detail || 'No se pudo generar un plan válido con tus datos actuales.';
          this.resumenIA = 'No se pudo generar la dieta por datos inválidos.';
        } else {
          this.errorVisual = 'Hubo un problema de conexión con el servicio de recomendaciones.';
          this.resumenIA = 'No se pudo generar la dieta por un error de servicio.';
        }
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  private aplicarDietaEnVista(dietaBase: any) {
    const dieta = this.normalizarRespuestaIA(dietaBase);

    this.caloriasTotales = Number(dieta.calorias_totales ?? 0);
    this.resumenIA = `Para alcanzar tu meta, tu plan de hoy está calculado en aproximadamente ${this.caloriasTotales} kcal. ${dieta.recomendacion_clave ?? ''}`;

    this.recomendaciones = [
      `🍳 Desayuno: ${dieta.desayuno ?? 'No disponible'}`,
      `🍲 Almuerzo: ${dieta.almuerzo ?? 'No disponible'}`,
      `🥗 Cena: ${dieta.cena ?? 'No disponible'}`,
      `💧 Mantén una hidratación constante durante el día.`
    ];

    this.nivelConfianza = Math.floor(Math.random() * (98 - 85 + 1)) + 85;
  }

  private esDietaValida(dieta: any): boolean {
    if (!dieta || typeof dieta !== 'object') {
      return false;
    }

    const desayuno = String(dieta.desayuno ?? '').trim().toLowerCase();
    const almuerzo = String(dieta.almuerzo ?? '').trim().toLowerCase();
    const cena = String(dieta.cena ?? '').trim().toLowerCase();

    return !!desayuno && desayuno !== 'no disponible'
      && !!almuerzo && almuerzo !== 'no disponible'
      && !!cena && cena !== 'no disponible';
  }

  private normalizarRespuestaIA(respuesta: any) {
    const base = respuesta?.data ?? respuesta?.resultado ?? respuesta;

    return {
      desayuno: base?.desayuno ?? base?.breakfast,
      almuerzo: base?.almuerzo ?? base?.lunch,
      cena: base?.cena ?? base?.dinner,
      calorias_totales: base?.calorias_totales ?? base?.caloriasTotales ?? base?.total_calories,
      recomendacion_clave: base?.recomendacion_clave ?? base?.recomendacionClave ?? base?.recommendation
    };
  }
}