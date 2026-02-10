import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-objetivo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './objetivo.html',
  styleUrls: ['./objetivo.scss']
})
export class ObjetivoComponent {

  // 1️⃣ Objetivo principal
  objetivoSeleccionado: 'bajar' | 'mantener' | 'subir' | null = null;

  seleccionarObjetivo(valor: 'bajar' | 'mantener' | 'subir') {
    this.objetivoSeleccionado = valor;
  }

  // 2️⃣ Ritmo
  ritmoSeleccionado: 'lento' | 'moderado' | 'rapido' | null = null;

  seleccionarRitmo(valor: 'lento' | 'moderado' | 'rapido') {
    this.ritmoSeleccionado = valor;
  }

  // 3️⃣ Preferencias alimenticias
  preferenciasSeleccionadas: string[] = [];

  togglePreferencia(preferencia: string) {
    if (this.preferenciasSeleccionadas.includes(preferencia)) {
      this.preferenciasSeleccionadas =
        this.preferenciasSeleccionadas.filter(p => p !== preferencia);
    } else {
      this.preferenciasSeleccionadas.push(preferencia);
    }
  }

}


