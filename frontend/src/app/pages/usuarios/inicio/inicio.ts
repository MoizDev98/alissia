import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule],

  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class Inicio {
 menu = [
  {
    titulo: 'Plan de comidas',
    descripcion: 'Consulta tu plan alimenticio diario.',
    ruta: '/usuarios/comidas',
    icono: 'bi bi-egg-fried'
  },
  {
    titulo: 'Progreso',
    descripcion: 'Monitorea tu avance nutricional.',
    ruta: '/usuarios/progreso',
    icono: 'bi bi-graph-up-arrow'
  },
  {
    titulo: 'Objetivos',
    descripcion: 'Define y revisa tus metas de salud.',
    ruta: '/usuarios/objetivo',
    icono: 'bi bi-bullseye'
  },
  {
    titulo: 'Recomendaciones',
    descripcion: 'Obtén sugerencias inteligentes personalizadas.',
    ruta: '/usuarios/recomendaciones',
    icono: 'bi bi-lightbulb-fill'
  },
  {
    titulo: 'Perfil',
    descripcion: 'Administra tu información personal.',
    ruta: '/usuarios/perfil',
    icono: 'bi bi-person-circle'
  },
  {
    titulo: 'Historial',
    descripcion: 'Revisa tus registros y hábitos anteriores.',
    ruta: '/usuarios/historial',
    icono: 'bi bi-clock-history'
  }
];
}



