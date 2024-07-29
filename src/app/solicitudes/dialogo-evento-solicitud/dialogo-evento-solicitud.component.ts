import { EventoSolicitudService } from './../../services/evento-solicitud.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { Usuario } from 'src/model/usuario';

@Component({
	selector: 'app-dialogo-evento-solicitud',
	templateUrl: './dialogo-evento-solicitud.component.html',
	styleUrls: ['./dialogo-evento-solicitud.component.css']
})
export class DialogoEventoSolicitudComponent implements OnInit {

	cargando: boolean = false;
	public eventoSolicitud: EventoSolicitud = new EventoSolicitud;
	usuario: Usuario = new Usuario;

	constructor(
		private eventoSolicitudService: EventoSolicitudService,
		public utilService: UtilService,
		private dialog: MatDialog,
		public dialogRef: MatDialogRef<DialogoEventoSolicitudComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
		this.eventoSolicitud.idSolicitud = data.idSolicitud;
		this.eventoSolicitud.usuario = this.usuario.nombre;
	}

	ngOnInit(): void {
	}

	typeSelected() { }

	crear() {
		this.cargando = true;
		this.eventoSolicitudService
			.crearEventoSolicitud(this.eventoSolicitud)
			.then(() => {
				this.cerrar('creado');
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false);
	}

	cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
