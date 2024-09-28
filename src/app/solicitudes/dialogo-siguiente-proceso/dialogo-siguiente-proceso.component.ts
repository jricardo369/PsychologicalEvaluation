import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisponibilidadUsuariosService } from 'src/app/services/disponibilidad-usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { DisponibilidadUsuario } from 'src/model/disponibilidad-usuario';
import { PaginationManager } from 'src/util/pagination';

@Component({
  selector: 'app-dialogo-siguiente-proceso',
  templateUrl: './dialogo-siguiente-proceso.component.html',
  styleUrls: ['./dialogo-siguiente-proceso.component.css']
})
export class DialogoSiguienteProcesoComponent implements OnInit {

  cargando: boolean = false;

  fecha: string = "";
  arrDisponibilidadUsuario: DisponibilidadUsuario[] = [];
  paginacion: PaginationManager = new PaginationManager();
  idDisponibilidadSelected: number = null;
  idSolicitud: number = null;
  idUsuario: number = null;
  interviewerScales: boolean = false;

  constructor(
    private disponibilidadUsuariosService: DisponibilidadUsuariosService,
    private solicitudesService: SolicitudesService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoSiguienteProcesoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.idSolicitud = data.idSolicitud;
      this.idUsuario = data.idUsuario;
      this.interviewerScales = data.interviewerScales;
  }

  ngOnInit(): void {
  }

  estaSeleccionado(idDisponibilidad: number) {
    return this.idDisponibilidadSelected == idDisponibilidad;
  }

  check(event: Event, idDisponibilidad: number) {
    console.log((event.srcElement as HTMLInputElement).checked)
    if ((event.srcElement as HTMLInputElement).checked) {
      if (!this.estaSeleccionado(idDisponibilidad)) this.idDisponibilidadSelected = idDisponibilidad;
    } else {
      if (this.estaSeleccionado(idDisponibilidad)) this.idDisponibilidadSelected = null;
    }
    console.log(this.idDisponibilidadSelected)
  }

  obtenerDisponibilidadUsuarios() {
    this.cargando = true;
    this.disponibilidadUsuariosService.obtenerDisponibilidadUsuariosPorDia(this.fecha)
      .then((disponibilidadUsuarios) => {
        this.arrDisponibilidadUsuario = disponibilidadUsuarios;
        this.paginacion.setArray(this.arrDisponibilidadUsuario);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  enviar() {
    let disponibilidadSelected = this.arrDisponibilidadUsuario[this.arrDisponibilidadUsuario.findIndex(disponibilidad => disponibilidad.idDisponibilidad == this.idDisponibilidadSelected)];
    console.log(disponibilidadSelected)
    this.cargando = true;
    let choosePromise = this.interviewerScales ? this.solicitudesService.envioInterviewerScales(this.idSolicitud, this.idUsuario, disponibilidadSelected.idDisponibilidad) : this.solicitudesService.envioSiguienteProceso(this.idSolicitud, this.idUsuario, disponibilidadSelected.idDisponibilidad);
    choosePromise
    .then(() => {
      this.cargando = false;
      this.cerrar('enviado');
    })
    .catch((reason) => this.utilService.manejarError(reason))
    .then(() => (this.cargando = false));
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }
}
