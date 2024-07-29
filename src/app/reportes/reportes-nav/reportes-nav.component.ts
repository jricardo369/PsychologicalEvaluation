import { Component, OnInit } from '@angular/core';
import { NAV_MENU_IZQUIERDA_STYLES, NAV_MENU_IZQUIERDA_TEMPLATE, UtilServiceTest } from 'src/app/app-nav-item';
import { Router } from '@angular/router';

import { REPORTES_ITEMS } from '../reportes-routing.module';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';
let ITEMS = REPORTES_ITEMS;

@Component({
	selector: 'app-reportes-nav',
	template: NAV_MENU_IZQUIERDA_TEMPLATE,
	styles: [NAV_MENU_IZQUIERDA_STYLES]
})
export class ReportesNavComponent extends UtilServiceTest {
	constructor(router: Router, utilService: UtilService, usuariosService: UsuariosService) {
		super(router, utilService, usuariosService, ITEMS);
	}
}
