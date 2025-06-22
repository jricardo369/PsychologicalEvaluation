import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesRoutingModule } from './reportes-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DentalUiModule } from '../dental-ui/dental-ui.module';
import { ReportesNavComponent } from './reportes-nav/reportes-nav.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ReporteSolicitudesUsuariosComponent } from './reporte-solicitudes-usuarios/reporte-solicitudes-usuarios.component';
import { ReporteCorreosEnviadosComponent } from './reporte-correos-enviados/reporte-correos-enviados.component';
import { ReporteMovimientosUsuarioComponent } from './reporte-movimientos-usuario/reporte-movimientos-usuario.component';
import { HomeComponent } from './home/home.component';
import { DialogoDetalleMovimientosComponent } from './dialogo-detalle-movimientos/dialogo-detalle-movimientos.component';
import { ReporteComparacionAniosComponent } from './reporte-comparacion-anios/reporte-comparacion-anios.component';
import { DialogoSolicitudesUsuarioComponent } from './dialogo-solicitudes-usuario/dialogo-solicitudes-usuario.component';
import { DialogoFilesLawyerComponent } from './dialogo-files-lawyer/dialogo-files-lawyer.component';


@NgModule({
  imports: [
		CommonModule,
		HttpClientModule,
		MatIconModule,
		MatProgressSpinnerModule,
		FormsModule,
		DentalUiModule,
		MatDialogModule,
		ReportesRoutingModule,
    MatCheckboxModule
	],
	entryComponents: [
    DialogoDetalleMovimientosComponent,
	DialogoSolicitudesUsuarioComponent,
	DialogoFilesLawyerComponent,
  ],
	declarations: [
		ReportesNavComponent,
    ReporteSolicitudesUsuariosComponent,
    ReporteCorreosEnviadosComponent,
    ReporteMovimientosUsuarioComponent,
    HomeComponent,
    DialogoDetalleMovimientosComponent,
    ReporteComparacionAniosComponent,
    DialogoSolicitudesUsuarioComponent,
    DialogoFilesLawyerComponent,
	],
	exports: []
})
export class ReportesModule { }
