import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsConditionsComponent } from '../../pages/register/terms-conditions/terms-conditions';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TermsConditionsComponent],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  mostrarTerminos = false;

  abrirTerminos() {
    this.mostrarTerminos = true;
  }

  cerrarTerminos() {
    this.mostrarTerminos = false;
  }
}