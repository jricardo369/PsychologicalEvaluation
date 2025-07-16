import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service'; // Ajusta según tu app
import { ADMIN_GENERAL_ITEMS } from './administracion-general-routing.module';
import { Usuario } from 'src/model/usuario';
import { BACKOFFICE, INTERVIEWER, INTERVIEWER_SCALES, MASTER, THERAPIST, VENDOR, VOC } from '../app.config';

@Component({
    selector: 'app-redirect-inicio',
    template: `<p>Redireccionando...</p>`,
})
export class RedirectInicioComponent implements OnInit {
    constructor(private router: Router, private session: SessionService) { }

    ngOnInit(): void {

        let usuario: Usuario = JSON.parse(localStorage.getItem('objUsuario'));
        if ([MASTER, BACKOFFICE, VOC].some(rol => rol == usuario.rol)) {
            this.router.navigateByUrl('/administracion-general/abogados');
        }
        else {
            this.router.navigateByUrl('/administracion-general/usuarios');
        }

    }
}
