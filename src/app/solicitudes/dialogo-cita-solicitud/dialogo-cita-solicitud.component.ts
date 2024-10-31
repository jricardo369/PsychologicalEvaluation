import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { Usuario } from 'src/model/usuario';

@Component({
  selector: 'app-dialogo-cita-solicitud',
  templateUrl: './dialogo-cita-solicitud.component.html',
  styleUrls: ['./dialogo-cita-solicitud.component.css']
})
export class DialogoCitaSolicitudComponent implements OnInit {

  cargando: boolean = false;
  public citaSolicitud: CitaSolicitud = new CitaSolicitud;
  usuario: Usuario = new Usuario;

  arrTime: string[] = [
    '12:00',
    '12:30',
    '1:00',
    '1:30',
    '2:00',
    '2:30',
    '3:00',
    '3:30',
    '4:00',
    '4:30',
    '5:00',
    '5:30',
    '6:00',
    '6:30',
    '7:00',
    '7:30',
    '8:00',
    '8:30',
    '9:00',
    '9:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30'
  ];

  constructor(
    private citaSolicitudService: CitaSolicitudService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoCitaSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
    this.citaSolicitud.idSolicitud = data.idSolicitud;
    this.citaSolicitud.dosCitas = false;
  }

  ngOnInit(): void {
  }

  crear() {
    this.cargando = true;
    this.citaSolicitudService
      .crearCitaSolicitud(this.citaSolicitud, this.usuario.idUsuario)
      .then(() => {
        this.cerrar('creado');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }

}