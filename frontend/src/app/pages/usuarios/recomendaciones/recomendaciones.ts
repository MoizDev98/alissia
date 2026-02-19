import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '/home/moises-solis/alissia_project/frontend/src/app/services/auth.service';
import { DataService } from '/home/moises-solis/alissia_project/frontend/src/app/services/data.service';
import { AiService } from '/home/moises-solis/alissia_project/frontend/src/app/services/ai.service';

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
          this.router.navigate(['usuarios/objetivo']);
        }
      },
      error: (err) => {
        console.error("Error buscando el perfil", err);
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

    this.aiService.generarDieta(datosParaIA).subscribe({
      next: (dietaGenerada) => {
        console.log("¡RESPUESTA RECIBIDA EN ANGULAR!", dietaGenerada);
        this.caloriasTotales = dietaGenerada.calorias_totales;
        
        this.resumenIA = `Para alcanzar tu meta, tu plan de hoy está calculado en aproximadamente ${this.caloriasTotales} kcal. ${dietaGenerada.recomendacion_clave}`;

        this.recomendaciones = [
          `🍳 Desayuno: ${dietaGenerada.desayuno}`,
          `🍲 Almuerzo: ${dietaGenerada.almuerzo}`,
          `🥗 Cena: ${dietaGenerada.cena}`,
          `💧 Mantén una hidratación constante durante el día.`
        ];

        this.nivelConfianza = Math.floor(Math.random() * (98 - 85 + 1)) + 85; 

        this.cargando = false;
        this.cdr.detectChanges();
        
      },
      error: (err) => {
        console.error("La IA falló", err);
        this.resumenIA = "Hubo un problema de conexión con el nutricionista virtual (IA). Por favor, recarga la página.";
        this.cargando = false;
      }
    });
  }
}