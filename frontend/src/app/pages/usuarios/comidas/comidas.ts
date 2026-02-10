import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comidas.html',
  styleUrls: ['./comidas.scss']
})
export class ComidasComponent {

  comidas = [
    {
      tipo: 'Desayuno',
      plan: 'Avena con fruta y yogurt',
      calorias: 350,
      estado: null, // null | 'cumplida' | 'no-cumplida'
      registro: ''
    },
    {
      tipo: 'Almuerzo',
      plan: 'Pollo a la plancha con arroz integral',
      calorias: 520,
      estado: null,
      registro: ''
    },
    {
      tipo: 'Cena',
      plan: 'Ensalada con proteína',
      calorias: 410,
      estado: null,
      registro: ''
    }
  ];

}
