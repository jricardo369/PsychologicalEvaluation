import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesRoutingModule } from './solicitudes-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DentalUiModule } from '../dental-ui/dental-ui.module';
import { SolicitudesNavComponent } from './solicitudes-nav/solicitudes-nav.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { EventosSolicitudComponent } from './eventos-solicitud/eventos-solicitud.component';
import { AdjuntosComponent } from './adjuntos/adjuntos.component';
import { DialogoEventoSolicitudComponent } from './dialogo-evento-solicitud/dialogo-evento-solicitud.component';
import { MovimientosSolicitudComponent } from './movimientos-solicitud/movimientos-solicitud.component';
import { DialogoMovimientoSolicitudComponent } from './dialogo-movimiento-solicitud/dialogo-movimiento-solicitud.component';
import { DialogoSiguienteProcesoComponent } from './dialogo-siguiente-proceso/dialogo-siguiente-proceso.component';
import { DialogoNotificacionesComponent } from './dialogo-notificaciones/dialogo-notificaciones.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DialogoSolicitudTelefonoComponent } from './dialogo-solicitud-telefono/dialogo-solicitud-telefono.component';
import { EnvioCorreosAbogadosComponent } from './envio-correos-abogados/envio-correos-abogados.component';

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		MatIconModule,
		MatProgressSpinnerModule,
		FormsModule,
		DentalUiModule,
		MatDialogModule,
		SolicitudesRoutingModule,
    MatCheckboxModule
	],
	entryComponents: [
    DialogoEventoSolicitudComponent,
    DialogoMovimientoSolicitudComponent,
    DialogoSiguienteProcesoComponent,
    DialogoNotificacionesComponent,
    DialogoSolicitudTelefonoComponent,
	],
	declarations: [
		SolicitudesNavComponent,
		SolicitudesComponent,
		SolicitudComponent,
		EventosSolicitudComponent,
		AdjuntosComponent,
		DialogoEventoSolicitudComponent,
		MovimientosSolicitudComponent,
		DialogoMovimientoSolicitudComponent,
		DialogoSiguienteProcesoComponent,
		DialogoNotificacionesComponent,
		DialogoSolicitudTelefonoComponent,
		EnvioCorreosAbogadosComponent,
	],
	exports: [
		EventosSolicitudComponent,
		AdjuntosComponent,
    MovimientosSolicitudComponent,
    DialogoEventoSolicitudComponent,
    DialogoMovimientoSolicitudComponent
	]
})
export class SolicitudesModule { }
