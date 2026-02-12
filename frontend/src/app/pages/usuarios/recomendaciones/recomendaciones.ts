import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendaciones.html',
  styleUrls: ['./recomendaciones.scss']
})
export class RecomendacionesComponent implements OnInit {

  // 🔹 Simulación de datos del usuario (luego vendrán de BD)
  objetivo: 'bajar' | 'mantener' | 'subir' = 'bajar';
  ritmo: 'lento' | 'moderado' | 'rapido' = 'moderado';

  // 🔹 Texto generado (simulación IA)
  resumenIA: string = '';

  // 🔹 Lista de recomendaciones
  recomendaciones: string[] = [];

  // 🔹 Nivel de confianza simulado
  nivelConfianza: number = 87;

  ngOnInit(): void {
    this.generarRecomendaciones();
  }

  generarRecomendaciones() {

    if (this.objetivo === 'bajar') {
      this.resumenIA = "Estás en un plan de pérdida de peso. Es importante mantener un déficit calórico moderado y priorizar alimentos altos en proteína.";

      this.recomendaciones = [
        "Aumenta el consumo de proteínas magras.",
        "Reduce azúcares añadidos y fritos.",
        "Mantén buena hidratación.",
        "Incluye vegetales en cada comida."
      ];
    }

    if (this.objetivo === 'mantener') {
      this.resumenIA = "Tu objetivo es mantener tu peso actual. El enfoque debe estar en el equilibrio y estabilidad calórica.";

      this.recomendaciones = [
        "Mantén porciones equilibradas.",
        "No elimines grupos alimenticios innecesariamente.",
        "Realiza actividad física moderada.",
        "Evita excesos frecuentes."
      ];
    }

    if (this.objetivo === 'subir') {
      this.resumenIA = "Estás buscando aumentar tu peso o masa muscular. Es recomendable un superávit calórico controlado.";

      this.recomendaciones = [
        "Incrementa calorías progresivamente.",
        "Prioriza proteína y carbohidratos complejos.",
        "Incluye entrenamiento de fuerza.",
        "Distribuye las comidas durante el día."
      ];
    }
  }

}
