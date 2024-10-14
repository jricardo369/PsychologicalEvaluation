import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBarNavItem } from '../app-nav-item';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, VENDOR, VOC } from '../app.config';
import { EnvioCorreosAbogadosComponent } from './envio-correos-abogados/envio-correos-abogados.component';

const routes: Routes = [
	{ path: 'solicitudes', component: SolicitudesComponent, },
	{ path: 'solicitudes/:id', component: SolicitudComponent, },
	{ path: 'solicitudes/nueva-solicitud', component: SolicitudComponent, },

	{ path: 'envio-correos-abogados', component: EnvioCorreosAbogadosComponent, },

	{ path: '', pathMatch: 'full', redirectTo: 'solicitudes' },
];

const MODULE: AppBarNavItem = {
	module: null,
	title: 'Files',
	subtitle: null,
	uri: 'solicitudes',
	svgName: 'assignment',
	isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, INTERVIEWER, VOC, TEMPLATE_CREATOR, INTERVIEWER_SCALES, GHOSTWRITING].some(rol => rol == u.rol)
};

export const SOLICITUDES_ITEMS: AppBarNavItem[] = [
	{
		module: MODULE,
		svgName: 'assignment-ind',
		title: 'Files',
		subtitle: 'Manage Files',
		uri: 'solicitudes',
		isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, INTERVIEWER, VOC, TEMPLATE_CREATOR, INTERVIEWER_SCALES, GHOSTWRITING].some(rol => rol == u.rol)
	},
  {
		module: MODULE,
		svgName: 'mail-sent',
		title: 'Mailings to lawyers',
		subtitle: 'Sending mailings to lawyers',
		uri: 'envio-correos-abogados',
		isVisibleFor: u => [MASTER, BACKOFFICE].some(rol => rol == u.rol)
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SolicitudesRoutingModule { }
