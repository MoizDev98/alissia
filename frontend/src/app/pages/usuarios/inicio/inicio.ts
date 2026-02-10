import { Component } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header";
import { FooterComponent } from "../../../components/footer/footer";
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-inicio',
  imports: [HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {

}
