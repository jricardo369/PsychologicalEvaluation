import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BACKOFFICE, GHOSTWRITING, MASTER, VENDOR } from 'src/app/app.config';
import { Usuario } from 'src/model/usuario';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  usuario: Usuario = new Usuario;

  constructor(private router: Router) {
    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
    if (this.usuario.rol == MASTER) {
      this.router.navigateByUrl('/reportes/solicitudes-usuarios');
    }
    else if (this.usuario.rol == VENDOR || this.usuario.rol == BACKOFFICE || this.usuario.rol == GHOSTWRITING) {
      this.router.navigateByUrl('/reportes/pagos');
    }
  }

}
