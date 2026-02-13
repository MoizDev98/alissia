import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Receta } from '../../../models/receta.interface';
import { ModalRecetaComponent } from '../components/modal-receta/modal-receta';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalRecetaComponent],
  templateUrl: './recetas.html',
  styleUrls: ['./recetas.scss']
})
export class RecetasComponent {

  busqueda: string = '';
  mostrarModal = false;
  recetaSeleccionada?: Receta;

  recetas: Receta[] = [
    {
      id: 1,
      nombre: 'Ensalada Proteica',
      descripcion: 'Ensalada rica en proteínas',
      alimentos: [],
      caloriasTotales: 350,
      estado: 0
    }
  ];

  get recetasFiltradas(): Receta[] {
    return this.recetas.filter(r =>
      r.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  abrirModal(receta?: Receta) {
    this.recetaSeleccionada = receta;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarReceta(receta: Receta) {
    if (receta.id) {
      const index = this.recetas.findIndex(r => r.id === receta.id);
      this.recetas[index] = receta;
    } else {
      receta.id = this.recetas.length + 1;
      receta.estado = 0; // siempre inicia pendiente
      this.recetas.push(receta);
    }
    this.cerrarModal();
  }

  cambiarEstado(receta: Receta) {
    receta.estado = receta.estado === 1 ? 0 : 1;
  }
}
