import { Routes } from '@angular/router';

import { ObjetivoComponent } from './pages/usuarios/objetivo/objetivo';
import { ComidasComponent } from './pages/usuarios/comidas/comidas';
import { PesoComponent } from './pages/usuarios/peso/peso';
import { ProgresoComponent } from './pages/usuarios/progreso/progreso';
import { RecomendacionesComponent } from './pages/usuarios/recomendaciones/recomendaciones';
import { Inicio } from './pages/usuarios/inicio/inicio';
import {  } from './pages/usuarios/inicio/inicio';
import { AdminHomeComponent } from './pages/admin/home/home';
import { GestionUsuariosComponent } from './pages/admin/gestion-usuarios/gestion-usuarios';
import { MetricasComponent } from './pages/admin/metricas/metricas';


    
export const routes: Routes = [
  {
    path: 'usuarios',
    children: [
      { path: 'objetivo', component: ObjetivoComponent },
      { path: 'comidas', component: ComidasComponent },
      { path: 'peso', component: PesoComponent },
      { path: 'progreso', component: ProgresoComponent },
      { path: 'recomendaciones', component: RecomendacionesComponent },
      { path: 'inicio', component: Inicio },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' }
    ]
  },

  {
    path: 'admin',
    children: [
      { path: 'home', component: AdminHomeComponent },
      { path: 'usuarios', component: GestionUsuariosComponent },
      { path: 'metricas', component: MetricasComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: 'usuarios/inicio', pathMatch: 'full' }
];
