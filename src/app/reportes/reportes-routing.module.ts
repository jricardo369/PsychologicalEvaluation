import { NgModule } from '@angular/core';
import { AppBarNavItem } from '../app-nav-item';
import { Routes, RouterModule } from '@angular/router';
import { BACKOFFICE, GHOSTWRITING, MASTER, VENDOR, VOC } from '../app.config';
import { ReporteSolicitudesUsuariosComponent } from './reporte-solicitudes-usuarios/reporte-solicitudes-usuarios.component';
import { ReporteCorreosEnviadosComponent } from './reporte-correos-enviados/reporte-correos-enviados.component';
import { ReporteMovimientosUsuarioComponent } from './reporte-movimientos-usuario/reporte-movimientos-usuario.component';
import { HomeComponent } from './home/home.component';
import { ReporteComparacionAniosComponent } from './reporte-comparacion-anios/reporte-comparacion-anios.component';
import { ReporteDashboardComponent } from './reporte-dashboard/reporte-dashboard.component';

const routes: Routes = [
	{ path: 'solicitudes-usuarios', component: ReporteSolicitudesUsuariosComponent },
	{ path: 'pagos', component: ReporteMovimientosUsuarioComponent, },
	{ path: 'correos-enviados', component: ReporteCorreosEnviadosComponent, },
	{ path: 'comparacion-anios', component: ReporteComparacionAniosComponent, },
	{ path: 'reporte-dashboard', component: ReporteDashboardComponent, },

  { path: 'home', component: HomeComponent },
	{ path: '', pathMatch: 'full', redirectTo: 'home' },
];

const MODULE: AppBarNavItem = {
	module: null,
	title: 'Reports',
	subtitle: null,
	uri: 'reportes',
	svgName: 'reports',
	isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, GHOSTWRITING, VOC].some(rol => rol == u.rol)
};

export const REPORTES_ITEMS: AppBarNavItem[] = [
	{
		module: MODULE,
		svgName: 'users-report',
		title: 'Users Files',
		subtitle: 'Reporting of users files',
		uri: 'solicitudes-usuarios',
		isVisibleFor: u => [MASTER,BACKOFFICE].some(rol => rol == u.rol)
	},
	{
		module: MODULE,
		svgName: 'payment',
		title: 'Payments',
		subtitle: 'Payments report',
		uri: 'pagos',
		isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, GHOSTWRITING].some(rol => rol == u.rol)
	},
	{
		module: MODULE,
		svgName: 'clasesg',
		title: 'Law Firm Files',
		subtitle: 'Report of Law Firm Files',
		uri: 'correos-enviados',
		isVisibleFor: u => [MASTER,BACKOFFICE,VOC].some(rol => rol == u.rol)
	},
	{
		module: MODULE,
		svgName: 'comparison',
		title: 'Comparison by Years',
		subtitle: 'Report of files comparison by years',
		uri: 'comparacion-anios',
		isVisibleFor: u => [MASTER].some(rol => rol == u.rol) || u.usuario == 'edgar' || u.usuario == 'juan'
	},
	{
		module: MODULE,
		svgName: 'dashboard',
		title: 'Dashboard',
		subtitle: 'Dashboard',
		uri: 'reporte-dashboard',
		isVisibleFor: u => [MASTER].some(rol => rol == u.rol) 
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ReportesRoutingModule { }
