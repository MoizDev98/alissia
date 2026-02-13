import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
    menu = [
    {
      titulo: 'Gestion de usurios',
      descripcion: '',
      ruta: '/admin/gestion-usuario',
      icono: ''
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
