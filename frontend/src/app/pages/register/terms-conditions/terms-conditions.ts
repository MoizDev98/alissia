import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,   // 👈 ESTO ES CLAVE
  imports: [CommonModule],
  templateUrl: './terms-conditions.html',
  styleUrls: ['./terms-conditions.scss']
})
export class TermsConditionsComponent {
  @Output() close = new EventEmitter<void>();

  cerrar() {
    this.close.emit();
  }
}