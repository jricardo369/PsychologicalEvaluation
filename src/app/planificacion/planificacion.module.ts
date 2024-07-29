import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PLanificacionRoutingModule } from './planificacion-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DentalUiModule } from '../dental-ui/dental-ui.module';
import { PlanificacionNavComponent } from './planificacion-nav/planificacion-nav.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DisponibilidadComponent } from './disponibilidad/disponibilidad.component';
import { DialogoDisponibilidadUsuarioComponent } from './dialogo-disponibilidad-usuario/dialogo-disponibilidad-usuario.component';

@NgModule({
  imports: [
		CommonModule,
		HttpClientModule,
		MatIconModule,
		MatProgressSpinnerModule,
		FormsModule,
		DentalUiModule,
		MatDialogModule,
		PLanificacionRoutingModule,
    MatCheckboxModule
	],
	entryComponents: [
    DialogoDisponibilidadUsuarioComponent
	],
	declarations: [
		PlanificacionNavComponent,
    DisponibilidadComponent,
    DialogoDisponibilidadUsuarioComponent,
	],
	exports: []
})
export class PlanificacionModule { }
