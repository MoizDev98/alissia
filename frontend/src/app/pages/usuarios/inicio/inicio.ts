import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../../components/header/header";
import { FooterComponent } from "../../../components/footer/footer";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],

  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class Inicio {
  menu = [
    {
      titulo: 'Registrar comidas',
      descripcion: 'Anota lo que consumes durante el día.',
      ruta: '/usuarios/comidas',
      icono: '🍽️'
    },
    {
      titulo: 'Definir objetivo',
      descripcion: 'Configura tu objetivo alimenticio.',
      ruta: '/usuarios/objetivo',
      icono: '🎯'
    },
    {
      titulo: 'Registrar peso',
      descripcion: 'Lleva seguimiento de tu peso.',
      ruta: '/usuarios/peso',
      icono: '⚖️'
    },
    {
      titulo: 'Ver progreso',
      descripcion: 'Observa tu evolución.',
      ruta: '/usuarios/progreso',
      icono: '📊'
    },
    {
      titulo: 'Recomendaciones',
      descripcion: 'Orientación alimenticia general.',
      ruta: '/usuarios/recomendaciones',
      icono: '💡'
    }
  ];
}



