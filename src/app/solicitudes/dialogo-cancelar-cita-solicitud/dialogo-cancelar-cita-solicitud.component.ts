import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { CitaActivaSolicitud } from 'src/model/cita-activa-solicitud';
import { EventoSolicitudService } from 'src/app/services/evento-solicitud.service';

@Component({
  selector: 'app-dialogo-cancelar-cita-solicitud',
  templateUrl: './dialogo-cancelar-cita-solicitud.component.html',
  styleUrls: ['./dialogo-cancelar-cita-solicitud.component.css']
})
export class DialogoCancelarCitaSolicitudComponent implements OnInit {

  cargando: boolean = false;

  arrCitasActivas: CitaActivaSolicitud[] = [];
  idEventoSelected: string = "";
  idSolicitud: number = null;
  idUsuarioEntrada: number = null;

  constructor(
    private eventoSolicitudService: EventoSolicitudService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoCancelarCitaSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.idSolicitud = data.idSolicitud;
    this.idUsuarioEntrada = data.idUsuario;
    this.obtenerCitasActivas();
  }

  ngOnInit(): void {
  }

  estaSeleccionado(idEvento: string) {
    return this.idEventoSelected == idEvento;
  }

  check(event: Event, idEvento: string) {
    if ((event.srcElement as HTMLInputElement).checked) {
      if (!this.estaSeleccionado(idEvento)) this.idEventoSelected = idEvento;
    } else {
      if (this.estaSeleccionado(idEvento)) this.idEventoSelected = null;
    }
  }

  obtenerCitasActivas() {
    this.cargando = true;
    this.eventoSolicitudService.obtenerCitasActivas(this.idSolicitud)
      .then(citasActivas => {
        this.arrCitasActivas = citasActivas;
        if (this.arrCitasActivas.length == 0) this.cerrar('vacio');
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  enviar() {
    this.cargando = true;
    this.eventoSolicitudService.cancelarCita(this.idEventoSelected, this.idUsuarioEntrada)
      .then(() => {
        this.cargando = false;
        this.cerrar('enviado');
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }
}
