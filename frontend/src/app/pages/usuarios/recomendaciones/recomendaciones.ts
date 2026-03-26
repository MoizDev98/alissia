import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { DataService } from '../../../services/data.service';
import { AiService } from '../../../services/ai.service';

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
  private aiService = inject(AiService);
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
      next: (perfil) => {
        if (perfil) {
          this.pedirDietaA_La_IA(perfil);
        } else {
          console.warn("Primero necesitamos tus medidas para que Kamoca trabaje.");
          this.router.navigate(['/usuarios/objetivo']);
        }
      },
      error: (err) => {
        console.error("Error buscando el perfil", err);
        this.router.navigate(['/usuarios/objetivo']);
        this.cargando = false;
      }
    });
  }

  pedirDietaA_La_IA(perfil: any) {
    
    console.log("Datos crudos del perfil:", perfil);

    const datosParaIA = {
      peso: Number(perfil.weight),
      altura: Number(perfil.height),
      edad: Number(perfil.age),
      genero: String(perfil.gender),
      objetivo: String(perfil.goal)
    };

    console.log("Datos limpios enviados a FastAPI:", datosParaIA);

    this.aiService.generarDieta(datosParaIA).pipe(
      timeout(8000)  // 8 segundos de timeout
    ).subscribe({
      next: (dietaGenerada) => {
        this.errorVisual = '';
        console.log("¡RESPUESTA RECIBIDA EN ANGULAR!", dietaGenerada);
        const dieta = this.normalizarRespuestaIA(dietaGenerada);

        // VERSION ANTERIOR (no borrar):
        // this.caloriasTotales = dietaGenerada.calorias_totales;
        // this.resumenIA = `Para alcanzar tu meta, tu plan de hoy está calculado en aproximadamente ${this.caloriasTotales} kcal. ${dietaGenerada.recomendacion_clave}`;
        // this.recomendaciones = [
        //   `🍳 Desayuno: ${dietaGenerada.desayuno}`,
        //   `🍲 Almuerzo: ${dietaGenerada.almuerzo}`,
        //   `🥗 Cena: ${dietaGenerada.cena}`,
        //   `💧 Mantén una hidratación constante durante el día.`
        // ];

        this.caloriasTotales = Number(dieta.calorias_totales ?? 0);
        this.resumenIA = `Para alcanzar tu meta, tu plan de hoy está calculado en aproximadamente ${this.caloriasTotales} kcal. ${dieta.recomendacion_clave ?? ''}`;

        this.recomendaciones = [
          `🍳 Desayuno: ${dieta.desayuno ?? 'No disponible'}`,
          `🍲 Almuerzo: ${dieta.almuerzo ?? 'No disponible'}`,
          `🥗 Cena: ${dieta.cena ?? 'No disponible'}`,
          `💧 Mantén una hidratación constante durante el día.`
        ];

        this.nivelConfianza = Math.floor(Math.random() * (98 - 85 + 1)) + 85; 

        this.cargando = false;
        this.cdr.detectChanges();
        
      },
      error: (err) => {
        console.error("La IA falló", err);
        console.error("Error name:", err?.name);
        console.error("Error message:", err?.message);
        
        if (err?.name === 'TimeoutError' || err?.message?.includes('timeout')) {
          this.errorVisual = '⏱️ La IA se está tardando demasiado. Verifica que el servidor esté activo e intenta nuevamente.';
          this.resumenIA = 'Tiempo de espera agotado.';
        } else if (err?.status === 400) {
          this.errorVisual = err?.error?.detail || 'Tus datos no cumplen con las validaciones. Corrígelos en Objetivo.';
          this.resumenIA = 'No se pudo generar la dieta por datos inválidos.';
        } else {
          this.errorVisual = 'Hubo un problema de conexión con el nutricionista virtual (IA). Intenta recargar la página.';
          this.resumenIA = 'No se pudo generar la dieta por un error de servicio.';
        }
        this.cargando = false;
        this.cdr.detectChanges();  // Forzar actualización de la UI
      }
    });
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