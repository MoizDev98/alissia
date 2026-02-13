import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Alimento {
  id?: number;
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  estado: number;
}

@Component({
  selector: 'app-modal-alimento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-alimento.html',
  styleUrls: ['./modal-alimento.scss']
})
export class ModalAlimentoComponent implements OnInit {

  @Input() alimentoEditar: Alimento | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<Alimento>();

  alimento: Alimento = {
    nombre: '',
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    estado: 1
  };

  modoEdicion = false;

  ngOnInit(): void {
    if (this.alimentoEditar) {
      this.alimento = { ...this.alimentoEditar };
      this.modoEdicion = true;
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  guardarAlimento(): void {
    this.guardar.emit(this.alimento);
    this.cerrarModal();
  }
}