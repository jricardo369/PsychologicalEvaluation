import { NgModule } from '@angular/core';
import { AppBarNavItem } from '../app-nav-item';
import { Routes, RouterModule } from '@angular/router';
import { BACKOFFICE, INTERVIEWER, MASTER, TEMPLATE_CREATOR, VENDOR, VOC } from '../app.config';
import { ReporteSolicitudesUsuariosComponent } from './reporte-solicitudes-usuarios/reporte-solicitudes-usuarios.component';
import { ReporteCorreosEnviadosComponent } from './reporte-correos-enviados/reporte-correos-enviados.component';
import { ReporteMovimientosUsuarioComponent } from './reporte-movimientos-usuario/reporte-movimientos-usuario.component';

const routes: Routes = [
	{ path: 'solicitudes-usuarios', component: ReporteSolicitudesUsuariosComponent, },
	{ path: 'pagos', component: ReporteMovimientosUsuarioComponent, },
	{ path: 'correos-enviados', component: ReporteCorreosEnviadosComponent, },

	{ path: '', pathMatch: 'full', redirectTo: 'solicitudes-usuarios' },
];

const MODULE: AppBarNavItem = {
	module: null,
	title: 'Reports',
	subtitle: null,
	uri: 'reportes',
	svgName: 'reports',
	isVisibleFor: u => [MASTER].some(rol => rol == u.rol)
};

export const REPORTES_ITEMS: AppBarNavItem[] = [
	{
		module: MODULE,
		svgName: 'users-report',
		title: 'Users Requests',
		subtitle: 'Reporting of users requests',
		uri: 'solicitudes-usuarios',
		isVisibleFor: u => [MASTER].some(rol => rol == u.rol)
	},
	{
		module: MODULE,
		svgName: 'payment',
		title: 'Payments',
		subtitle: 'Payments report',
		uri: 'pagos',
		isVisibleFor: u => [MASTER].some(rol => rol == u.rol)
	},
	{
		module: MODULE,
		svgName: 'mail-sent',
		title: 'Sent Emails',
		subtitle: 'Report of sent emails',
		uri: 'correos-enviados',
		isVisibleFor: u => [MASTER].some(rol => rol == u.rol)
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportesRoutingModule { }
