import { NgModule } from '@angular/core';
import { AppBarNavItem } from '../app-nav-item';
import { Routes, RouterModule } from '@angular/router';
import { BACKOFFICE, INTERVIEWER, MASTER, TEMPLATE_CREATOR, VENDOR, VOC } from '../app.config';
import { DisponibilidadComponent } from './disponibilidad/disponibilidad.component';

const routes: Routes = [
	{ path: 'disponibilidad', component: DisponibilidadComponent, },

	{ path: '', pathMatch: 'full', redirectTo: 'disponibilidad' },
];

const MODULE: AppBarNavItem = {
	module: null,
	title: 'Planning',
	subtitle: null,
	uri: 'planificacion',
	svgName: 'planning',
	isVisibleFor: u => [INTERVIEWER].some(rol => rol == u.rol)
};

export const PLANIFICACION_ITEMS: AppBarNavItem[] = [
	{
		module: MODULE,
		svgName: 'availability',
		title: 'Availability',
		subtitle: 'Manage availability',
		uri: 'disponibilidad',
		isVisibleFor: u => [INTERVIEWER].some(rol => rol == u.rol)
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PLanificacionRoutingModule { }
