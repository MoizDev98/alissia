import { Routes } from '@angular/router';
import { ObjetivoComponent } from './pages/usuarios/objetivo/objetivo';
import { ComidasComponent } from './pages/usuarios/comidas/comidas';
import { PesoComponent } from './pages/usuarios/peso/peso';
import { ProgresoComponent } from './pages/usuarios/progreso/progreso';
import { RecomendacionesComponent } from './pages/usuarios/recomendaciones/recomendaciones';
import { Inicio } from './pages/usuarios/inicio/inicio';
import { ContexturaComponent } from './pages/usuarios/contextura/contextura';
import { AdminHomeComponent } from './pages/admin/home/home';
import { GestionUsuariosComponent } from './pages/admin/gestion-usuarios/gestion-usuarios';
import { MetricasComponent } from './pages/admin/metricas/metricas';
import { AlimentosComponent } from './pages/nutricionista/alimentos/alimentos';
import { NutricionistaHomeComponent } from './pages/nutricionista/home/home';
import { RecetasComponent } from './pages/nutricionista/recetas/recetas';
import { Home } from './pages/home/home';
import { loginComponent} from './pages/login/login';
import { registerComponent} from './pages/register/form/register';
import { TermsConditionsComponent } from '../app/pages/register/terms-conditions/terms-conditions';
import { CompletarPerfilComponent } from '../app/pages/register/complete-profile/complete-profile';
import { Contactos } from './pages/contactos/contactos';
import { SobreNosotros } from './pages/sobre-nosotros/sobre-nosotros';
import { Comunidad } from './pages/comunidad/comunidad';

export const routes: Routes = [
  {
    path: 'usuarios',
    children: [
      { path: 'objetivo', component: ObjetivoComponent },
      { path: 'comidas', component: ComidasComponent },
      { path: 'peso', component: PesoComponent },
      { path: 'progreso', component: ProgresoComponent },
      { path: 'recomendaciones', component: RecomendacionesComponent },
      { path: 'contextura', component: ContexturaComponent },
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

  {
    path: 'nutricionista',
    children: [
      { path: 'home', component: NutricionistaHomeComponent },
      { path: 'alimentos', component: AlimentosComponent },
      { path: 'recetas', component: RecetasComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  { path: '', component: Home },
  { path: 'login', component: loginComponent },


  { 
    path: 'register', 
    children: [
      {path: 'form', component: registerComponent },
      {path: 'termsConditions', component: TermsConditionsComponent },
      {path: 'complete-profile', component: CompletarPerfilComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full' }    
    ]
  },

   {
    path: 'contactos',
    component: Contactos
  },

  {
    path: 'sobre-nosotros',
    component: SobreNosotros
  },

  {
    path: 'comunidad',
    component: Comunidad
  }
];

