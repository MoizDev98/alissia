import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '/home/moises-solis/alissia_project/frontend/src/app/services/auth.service';
import { DataService } from '/home/moises-solis/alissia_project/frontend/src/app/services/data.service';
import { PatientProfile } from '/home/moises-solis/alissia_project/frontend/src/app/models/data.model';

@Component({
  selector: 'app-objetivo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './objetivo.html',
  styleUrls: ['./objetivo.scss']
})
export class ObjetivoComponent implements OnInit {

  
  private authService = inject(AuthService);
  private dataService = inject(DataService);
  private router = inject(Router);

  
  usuarioActual: any = null;
  cargando = false;

  peso: number | null = null;
  altura: number | null = null;
  edad: number | null = null;
  genero: string = '';

  ngOnInit() {
    this.usuarioActual = this.authService.getCurrentUser();
  }

  objetivoSeleccionado: 'bajar' | 'mantener' | 'subir' | null = null;
  seleccionarObjetivo(valor: 'bajar' | 'mantener' | 'subir') { this.objetivoSeleccionado = valor; }

  ritmoSeleccionado: 'lento' | 'moderado' | 'rapido' | null = null;
  seleccionarRitmo(valor: 'lento' | 'moderado' | 'rapido') { this.ritmoSeleccionado = valor; }

  preferenciasSeleccionadas: string[] = [];
  togglePreferencia(preferencia: string) {
    if (this.preferenciasSeleccionadas.includes(preferencia)) {
      this.preferenciasSeleccionadas = this.preferenciasSeleccionadas.filter(p => p !== preferencia);
    } else {
      this.preferenciasSeleccionadas.push(preferencia);
    }
  }

  guardarTodo() {
    if (!this.peso || !this.altura || !this.edad || !this.genero || !this.objetivoSeleccionado) {
      alert("Por favor completa tus medidas y elige un objetivo principal.");
      return;
    }

    if (!this.usuarioActual) {
      alert("Error: No has iniciado sesión.");
      return;
    }

    this.cargando = true;

    const metaParaLaIA = `Quiero ${this.objetivoSeleccionado} de peso. Ritmo: ${this.ritmoSeleccionado || 'normal'}. Preferencias: ${this.preferenciasSeleccionadas.join(', ') || 'Ninguna'}`;

    const perfilParaGuardar: PatientProfile = {
      user_id: this.usuarioActual.id,
      weight: this.peso,
      height: this.altura,
      age: this.edad,
      gender: this.genero,
      activity_level: 'Moderado',
      goal: metaParaLaIA
    };

    this.dataService.saveProfile(perfilParaGuardar).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['usuarios/recomendaciones']);
      },
      error: (err) => {
        console.error(err);
        alert("Hubo un error al guardar tus datos.");
        this.cargando = false;
      }
    });
  }
}