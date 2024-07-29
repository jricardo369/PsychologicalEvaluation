import { Component, OnInit } from '@angular/core';
import { TareasProgramadasService } from 'src/app/services/tareas-programadas.service';
import { UtilService } from 'src/app/services/util.service';
import { TareaProgramada } from 'src/model/tarea-programada';

@Component({
	selector: 'app-tareas-programadas',
	templateUrl: './tareas-programadas.component.html',
	styleUrls: ['./tareas-programadas.component.css']
})
export class TareasProgramadasComponent {
	arrTareas: Array<TareaProgramada> = [];
	tarea = new TareaProgramada;
	todayISOString: string = new Date().toISOString();

	cargando: boolean = false;
	dias: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	cambiandoDiaEnvioRecordatorioPago: boolean = false;
	diaEnvioRecordatorioPago: string = 'Monday';
	diaEnvioRecordatorioPagoOld: string = 'Monday';
	horaEnvioRecordatorioPago: string = '00:00';
	horaEnvioRecordatorioPagoOld: string = '00:00';
	descripcionRecordatorioPagoOld: string = '';

	cambiandoDiaEnvioRecordatorioSolicitudes: boolean = false;
	diaEnvioRecordatorioSolicitudes: string = 'Monday';
	diaEnvioRecordatorioSolicitudesOld: string = 'Monday';
	horaEnvioRecordatorioSolicitudes: string = '00:00';
	horaEnvioRecordatorioSolicitudesOld: string = '00:00';
	descripcionRecordatorioSolicitudesOld: string = '00:00';

	constructor(public tareasService: TareasProgramadasService,
		public utilService: UtilService) {
		this.obtenerTareas();
	}

	obtenerTareas() {
		this.cargando = true;
		this.tareasService.getTareas()
			.subscribe(result => {
				this.arrTareas = result;
				this.procesarTareas();
			},
				error => {
					this.utilService.manejarError(error);
				});
	}

	procesarTareas() {
		for (let index = 0; index < this.arrTareas.length; index++) {
			switch (Number(this.arrTareas[index].idTareaProgramada)) {
				case 1:
					this.diaEnvioRecordatorioPago = this.arrTareas[index].dia;
					this.horaEnvioRecordatorioPago = this.arrTareas[index].hora;
					this.diaEnvioRecordatorioPagoOld = this.diaEnvioRecordatorioPago;
					this.horaEnvioRecordatorioPagoOld = this.horaEnvioRecordatorioPago;
          this.descripcionRecordatorioPagoOld = this.arrTareas[index].descripcion;
					break;
				case 2:
					this.diaEnvioRecordatorioSolicitudes = this.arrTareas[index].dia;
					this.horaEnvioRecordatorioSolicitudes = this.arrTareas[index].hora;
					this.diaEnvioRecordatorioSolicitudesOld = this.diaEnvioRecordatorioSolicitudes;
					this.horaEnvioRecordatorioSolicitudesOld = this.horaEnvioRecordatorioSolicitudes;
          this.descripcionRecordatorioSolicitudesOld = this.arrTareas[index].descripcion;
					break;
				default:
					break;
			}
		}
		this.cargando = false;
	}

	cambiarDato(caso: number) {
		var fecha = this.todayISOString.split('T', 1);
		this.tarea.idTareaProgramada = caso;
		this.tarea.codigo = this.arrTareas[caso - 1].codigo;
		this.tarea.descripcion = this.arrTareas[caso - 1].descripcion;
		this.tarea.fechaModificacion = fecha.toString();
		switch (caso) {
			case 1:
				this.tarea.dia = this.diaEnvioRecordatorioPago;
				this.tarea.hora = this.horaEnvioRecordatorioPago;
				break;
			case 2:
				this.tarea.dia = this.diaEnvioRecordatorioSolicitudes;
				this.tarea.hora = this.horaEnvioRecordatorioSolicitudes;
				break;
			default:
				break;
		}

		this.cargando = true;
		this.tareasService
			.asignarVariable(this.tarea)
			.then(response => {
				this.utilService.mostrarDialogoSimple("Change made successfully", "");
				if (response.status === 200) {
					switch (caso) {
						case 1:
							this.diaEnvioRecordatorioPagoOld = this.diaEnvioRecordatorioPago;
							this.horaEnvioRecordatorioPagoOld = this.horaEnvioRecordatorioPago;
							this.cambiandoDiaEnvioRecordatorioPago = false;
							break;
						case 2:
							this.diaEnvioRecordatorioSolicitudesOld = this.diaEnvioRecordatorioSolicitudes;
							this.horaEnvioRecordatorioSolicitudesOld = this.horaEnvioRecordatorioSolicitudes;
							this.cambiandoDiaEnvioRecordatorioSolicitudes = false;
							break;
						default:
							break;
					}
					this.obtenerTareas();
					this.cargando = false;
				}
			}).catch(error => {
				this.cargando = false;
				this.utilService.mostrarDialogoSimple("Error: " + error.message, "It was not possible to make the change.");
				this.cancelarCambio(caso);
			});
	}

	cancelarCambio(caso: number) {
		switch (caso) {
			case 1:
				this.cambiandoDiaEnvioRecordatorioPago = false;
				this.diaEnvioRecordatorioPago = this.diaEnvioRecordatorioPagoOld;
				this.horaEnvioRecordatorioPago = this.horaEnvioRecordatorioPagoOld;
				break;
			case 2:
				this.cambiandoDiaEnvioRecordatorioSolicitudes = false;
				this.diaEnvioRecordatorioSolicitudes = this.diaEnvioRecordatorioSolicitudesOld;
				this.horaEnvioRecordatorioSolicitudes = this.horaEnvioRecordatorioSolicitudesOld;
				break;
			default:
				break;
		}
	}

	ejecutarTarea(caso: number) {
		this.utilService.mostrarDialogoSimple(
			"Execute Task",
			"The task will be executed manually.",
			"Task", "Cancel")
		.then(valor => {
			console.log(valor)
			if (valor == 'ok') {
				this.cargando = true;
				this.tareasService
					.ejecutarTarea(this.arrTareas[caso - 1].codigo)
					.then(() => {
						this.utilService.mostrarDialogoSimple("Task executed correctly", "");
						this.cargando = false;
					}).catch(reason => this.utilService.manejarError(reason))
					.then(() => this.cargando = false);
			}
		}).catch(reason => this.utilService.manejarError(reason));
	}
}
