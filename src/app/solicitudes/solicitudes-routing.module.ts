import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBarNavItem } from '../app-nav-item';
import { Routes, RouterModule } from '@angular/router';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, THERAPIST, VENDOR, VOC,CLINICIAN } from '../app.config';
import { EnvioCorreosAbogadosComponent } from './envio-correos-abogados/envio-correos-abogados.component';
import { SolicitudesVocComponent } from './solicitudes-voc/solicitudes-voc.component';
import { SolicitudVocComponent } from './solicitud-voc/solicitud-voc.component';
import { HomeComponent } from './home/home.component';
import { CitasComponent } from './citas/citas.component';
import { CargosVocComponent } from './cargos-voc/cargos-voc.component';


const routes: Routes = [
	{ path: 'solicitudes-voc', component: SolicitudesVocComponent, },
	{ path: 'solicitudes-voc/:id', component: SolicitudVocComponent, },
	{ path: 'solicitudes-voc/nueva-solicitud', component: SolicitudVocComponent, },

	{ path: 'solicitudes', component: SolicitudesComponent, },
	{ path: 'solicitudes/:id', component: SolicitudComponent, },
	{ path: 'solicitudes/nueva-solicitud', component: SolicitudComponent, },

	{ path: 'envio-correos-abogados', component: EnvioCorreosAbogadosComponent, },
	{ path: 'citas', component: CitasComponent, },
	{ path: 'cargos-voc', component: CargosVocComponent, },

  { path: 'home', component: HomeComponent },
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
];

const MODULE: AppBarNavItem = {
	module: null,
	title: 'Files',
	subtitle: null,
	uri: 'solicitudes',
	svgName: 'assignment',
	isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, INTERVIEWER, VOC, TEMPLATE_CREATOR, INTERVIEWER_SCALES, GHOSTWRITING, THERAPIST,CLINICIAN].some(rol => rol == u.rol)
};

export const SOLICITUDES_ITEMS: AppBarNavItem[] = [
	{
		module: MODULE,
		svgName: 'assignment-ind',
		title: 'Files',
		subtitle: 'Manage Files',
		uri: 'solicitudes',
		isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, INTERVIEWER, TEMPLATE_CREATOR, INTERVIEWER_SCALES, GHOSTWRITING,CLINICIAN].some(rol => rol == u.rol)
	},
  {
		module: MODULE,
		svgName: 'assignment-ind',
		title: 'Files VOC',
		subtitle: 'Manage Files VOC',
		uri: 'solicitudes-voc',
		isVisibleFor: u => [VOC, THERAPIST].some(rol => rol == u.rol)
	},
 /* {
		module: MODULE,
		svgName: 'mail-sent',
		title: 'Mailings to lawyers',
		subtitle: 'Sending mailings to lawyers',
		uri: 'envio-correos-abogados',
		isVisibleFor: u => [MASTER, BACKOFFICE].some(rol => rol == u.rol)
	},*/
  {
		module: MODULE,
		svgName: 'schedule',
		title: 'Schedules',
		subtitle: 'See scheduled appointments',
		uri: 'citas',
		isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, INTERVIEWER, INTERVIEWER_SCALES, THERAPIST,CLINICIAN].some(rol => rol == u.rol)
	},
  {
		module: MODULE,
		svgName: 'pay-per-click-payment',
		title: 'VOC Charges',
		subtitle: 'Charges from Files VOC',
		uri: 'cargos-voc',
		isVisibleFor: u => [VOC].some(rol => rol == u.rol)
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SolicitudesRoutingModule { }
