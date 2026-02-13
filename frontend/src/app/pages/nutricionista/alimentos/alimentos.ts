import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalAlimentoComponent } from '../components/modal-alimento/modal-alimento';

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
  selector: 'app-alimentos',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalAlimentoComponent],
  templateUrl: './alimentos.html',
  styleUrls: ['./alimentos.scss']
})
export class AlimentosComponent implements OnInit {

  alimentos: Alimento[] = [
    {
      id: 1,
      nombre: 'Manzana',
      calorias: 52,
      proteinas: 0.3,
      carbohidratos: 14,
      grasas: 0.2,
      estado: 1
    },
    {
      id: 2,
      nombre: 'Pechuga de Pollo',
      calorias: 165,
      proteinas: 31,
      carbohidratos: 0,
      grasas: 3.6,
      estado: 1
    },
    {
      id: 3,
      nombre: 'Arroz Blanco',
      calorias: 130,
      proteinas: 2.7,
      carbohidratos: 28,
      grasas: 0.3,
      estado: 0
    }
  ];

  filtroNombre: string = '';
  mostrarModal: boolean = false;
  alimentoSeleccionado: Alimento | null = null;

  constructor() { }

  ngOnInit(): void {}

  get alimentosFiltrados() {
    return this.alimentos.filter(a =>
      a.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  abrirModal(alimento?: Alimento): void {
    this.alimentoSeleccionado = alimento || null;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.alimentoSeleccionado = null;
  }

  agregarAlimento(alimento: Alimento): void {
    if (this.alimentoSeleccionado) {
      const index = this.alimentos.findIndex(a => a.id === this.alimentoSeleccionado?.id);
      if (index !== -1) {
        this.alimentos[index] = { ...alimento, id: this.alimentoSeleccionado?.id };
      }
    } else {
      const nuevoId = Math.max(...this.alimentos.map(a => a.id || 0)) + 1;
      this.alimentos.push({ ...alimento, id: nuevoId });
    }

    this.alimentoSeleccionado = null;
  }

  cambiarEstado(alimento: Alimento): void {
    const index = this.alimentos.findIndex(a => a.id === alimento.id);
    if (index !== -1) {
      this.alimentos[index].estado = this.alimentos[index].estado === 1 ? 0 : 1;
    }
  }
}