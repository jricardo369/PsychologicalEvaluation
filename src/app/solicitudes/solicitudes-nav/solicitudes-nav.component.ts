import { Component, OnInit } from '@angular/core';
import { NAV_MENU_IZQUIERDA_STYLES, NAV_MENU_IZQUIERDA_TEMPLATE, UtilServiceTest } from 'src/app/app-nav-item';
import { Router } from '@angular/router';

import { SOLICITUDES_ITEMS } from '../solicitudes-routing.module';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';
let ITEMS = SOLICITUDES_ITEMS;

@Component({
	selector: 'app-solicitudes-nav',
	template: NAV_MENU_IZQUIERDA_TEMPLATE,
	styles: [NAV_MENU_IZQUIERDA_STYLES]
})
export class SolicitudesNavComponent extends UtilServiceTest {
	constructor(router: Router, utilService: UtilService, usuariosService: UsuariosService) {
		super(router, utilService, usuariosService, ITEMS);
	}
}
