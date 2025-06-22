import { NgModule } from '@angular/core';
import { AppBarNavItem } from '../app-nav-item';
import { Routes, RouterModule } from '@angular/router';
import { INTERVIEWER, INTERVIEWER_SCALES, CLINICIAN } from '../app.config';
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
	isVisibleFor: u => [INTERVIEWER, INTERVIEWER_SCALES, CLINICIAN].some(rol => rol == u.rol)
};

export const PLANIFICACION_ITEMS: AppBarNavItem[] = [
	{
		module: MODULE,
		svgName: 'availability',
		title: 'Availability',
		subtitle: 'Manage availability',
		uri: 'disponibilidad',
		isVisibleFor: u => [INTERVIEWER, INTERVIEWER_SCALES, CLINICIAN].some(rol => rol == u.rol)
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PLanificacionRoutingModule { }
