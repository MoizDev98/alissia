import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth.service';

@Component({  
  selector: 'app-header', 
  standalone: true,       
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuarioLogueado: any = null;

  ngOnInit() {
   
    this.authService.currentUser$.subscribe(user => {
      this.usuarioLogueado = user;
    });
  }

  get rutaDelPanel(): string {
    if (!this.usuarioLogueado) return '/';
    
    if (this.usuarioLogueado.role_id === 1) {
      return '/admin/home';
    } else if (this.usuarioLogueado.role_id === 2) {
      return '/nutricionista/home';
    } else {
      return '/usuarios/inicio';
    }
  }

  salir() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}