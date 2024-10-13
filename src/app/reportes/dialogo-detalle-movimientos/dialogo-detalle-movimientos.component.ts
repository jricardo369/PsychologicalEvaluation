import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MovimientoSolicitudService } from 'src/app/services/movimiento-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { DetalleMovimientosSolicitud } from '../../../model/datalle-movimientos-solicitud';

@Component({
  selector: 'app-dialogo-detalle-movimientos',
  templateUrl: './dialogo-detalle-movimientos.component.html',
  styleUrls: ['./dialogo-detalle-movimientos.component.css']
})
export class DialogoDetalleMovimientosComponent implements OnInit {

  cargando: boolean = false;
  idSolicitud: number = null;
  detalleMovimientos: DetalleMovimientosSolicitud = new DetalleMovimientosSolicitud();

  constructor(
    private movimientoSolicitudService: MovimientoSolicitudService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoDetalleMovimientosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.idSolicitud = data.idSolicitud;
      this.obtenerDetalleMovimientosSolicitud();
  }

  ngOnInit(): void {
  }

  obtenerDetalleMovimientosSolicitud() {
    this.cargando = true;
    this.movimientoSolicitudService.obtenerDetalleMovimientosSolicitud(this.idSolicitud)
      .then((detalleMovimientos) => {
        this.detalleMovimientos = detalleMovimientos;
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  // enviar() {
  //   let disponibilidadSelected = this.arrDisponibilidadUsuario[this.arrDisponibilidadUsuario.findIndex(disponibilidad => disponibilidad.idDisponibilidad == this.idDisponibilidadSelected)];
  //   console.log(disponibilidadSelected)
  //   this.cargando = true;
  //   let choosePromise = this.interviewerScales ? this.solicitudesService.envioInterviewerScales(this.idSolicitud, this.idUsuario, disponibilidadSelected.idDisponibilidad) : this.solicitudesService.envioSiguienteProceso(this.idSolicitud, this.idUsuario, disponibilidadSelected.idDisponibilidad);
  //   choosePromise
  //   .then(() => {
  //     this.cargando = false;
  //     this.cerrar('enviado');
  //   })
  //   .catch((reason) => this.utilService.manejarError(reason))
  //   .then(() => (this.cargando = false));
  // }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }
}
