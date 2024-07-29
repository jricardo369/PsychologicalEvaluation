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
	entryComponents: [],
	declarations: [
		ReportesNavComponent,
    ReporteSolicitudesUsuariosComponent,
    ReporteCorreosEnviadosComponent,
    ReporteMovimientosUsuarioComponent,
	],
	exports: []
})
export class ReportesModule { }
