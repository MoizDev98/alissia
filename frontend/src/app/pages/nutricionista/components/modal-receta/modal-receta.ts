import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Receta } from '../../../../models/receta.interface';

@Component({
  selector: 'app-modal-receta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-receta.html',
  styleUrls: ['./modal-receta.scss']
})
export class ModalRecetaComponent {

  @Input() recetaEditar?: Receta;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<Receta>();

  receta: Receta = {
    id: 0,
    nombre: '',
    descripcion: '',
    alimentos: [],
    caloriasTotales: 0,
    estado: 0
  };

  ngOnInit() {
    if (this.recetaEditar) {
      this.receta = { ...this.recetaEditar };
    }
  }

  guardarReceta() {
    this.guardar.emit(this.receta);
  }
}
