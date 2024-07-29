import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NAV_MENU_IZQUIERDA_TEMPLATE, UtilServiceTest, NAV_MENU_IZQUIERDA_STYLES } from '../../app-nav-item';

import { ADMIN_GENERAL_ITEMS } from '../administracion-general-routing.module';
import { UtilService } from 'src/app/services/util.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
let ITEMS = ADMIN_GENERAL_ITEMS;

@Component({
    selector: 'app-general-nav',
    template: NAV_MENU_IZQUIERDA_TEMPLATE,
    styles: [NAV_MENU_IZQUIERDA_STYLES]
})
export class GeneralNavComponent extends UtilServiceTest {
    constructor(router: Router, utilService: UtilService, usuariosService: UsuariosService) {
        super(router, utilService, usuariosService, ITEMS);
    }
}