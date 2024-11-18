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
import { SolicitudesVocComponent } from './solicitudes-voc/solicitudes-voc.component';
import { SolicitudVocComponent } from './solicitud-voc/solicitud-voc.component';
import { AdjuntosVocComponent } from './adjuntos-voc/adjuntos-voc.component';
import { EventosSolicitudVocComponent } from './eventos-solicitud-voc/eventos-solicitud-voc.component';
import { DialogoEventoSolicitudVocComponent } from './dialogo-evento-solicitud-voc/dialogo-evento-solicitud-voc.component';
import { DialogoAsignarTerapeutaComponent } from './dialogo-asignar-terapeuta/dialogo-asignar-terapeuta.component';
import { HomeComponent } from './home/home.component';
import { CitasSolicitudComponent } from './citas-solicitud/citas-solicitud.component';
import { DialogoCitaSolicitudComponent } from './dialogo-cita-solicitud/dialogo-cita-solicitud.component';
import { DialogoCancelarCitaSolicitudComponent } from './dialogo-cancelar-cita-solicitud/dialogo-cancelar-cita-solicitud.component';
import { CitasComponent } from './citas/citas.component';
import { CargosVocComponent } from './cargos-voc/cargos-voc.component';

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
    DialogoEventoSolicitudVocComponent,
    DialogoAsignarTerapeutaComponent,
    DialogoCitaSolicitudComponent,
    DialogoCancelarCitaSolicitudComponent
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
		SolicitudesVocComponent,
		SolicitudVocComponent,
		AdjuntosVocComponent,
		EventosSolicitudVocComponent,
		DialogoEventoSolicitudVocComponent,
		DialogoAsignarTerapeutaComponent,
		HomeComponent,
		CitasSolicitudComponent,
		DialogoCitaSolicitudComponent,
		DialogoCancelarCitaSolicitudComponent,
		CitasComponent,
		CargosVocComponent,
	],
	exports: [
		EventosSolicitudComponent,
		AdjuntosComponent,
    MovimientosSolicitudComponent,
    DialogoEventoSolicitudComponent,
    DialogoMovimientoSolicitudComponent,
    AdjuntosVocComponent,
    EventosSolicitudVocComponent,
    DialogoEventoSolicitudVocComponent,
    CitasSolicitudComponent,
    DialogoCitaSolicitudComponent
	]
})
export class SolicitudesModule { }
