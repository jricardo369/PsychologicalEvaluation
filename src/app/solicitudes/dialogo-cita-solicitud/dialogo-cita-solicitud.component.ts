import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';
import { NotaCitaService } from 'src/app/services/nota-cita.service';
import { SolicitudesVocService } from 'src/app/services/solicitudes-voc.service';
import { UtilService } from 'src/app/services/util.service';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { NotaCita } from 'src/model/nota-cita';
import { SolicitudVoc } from 'src/model/solicitud-voc';
import { Usuario } from 'src/model/usuario';

@Component({
  selector: 'app-dialogo-cita-solicitud',
  templateUrl: './dialogo-cita-solicitud.component.html',
  styleUrls: ['./dialogo-cita-solicitud.component.css']
})
export class DialogoCitaSolicitudComponent implements OnInit {

  cargando: boolean = false;
  public citaSolicitud: CitaSolicitud = new CitaSolicitud;
  arrNotasCita: NotaCita[] = [];
  nuevaNotaCita: NotaCita = new NotaCita();
  usuario: Usuario = new Usuario;
  creando: boolean = false;
  verSolicitud: boolean = false;
  arrSolicitudesVoc: SolicitudVoc[] = [];

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
    private solicitudesVOCService: SolicitudesVocService,
    private citaSolicitudService: CitaSolicitudService,
    private notaCitaService: NotaCitaService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoCitaSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
    this.citaSolicitud.idSolicitud = data.idSolicitud;
    this.creando = data.creando;
    this.verSolicitud = data.verSolicitud;
    if (!this.creando) {
      this.citaSolicitud = data.citaSolicitud;
      this.nuevaNotaCita.idCita = this.citaSolicitud.idCita;
      this.obtenerNotasCita();
    }
    if(this.verSolicitud) this.obtenerSolicitudesActivasUsuario();
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

  no_show() {
    this.cargando = true;
    this.citaSolicitudService
      .no_show(this.citaSolicitud.idCita, this.usuario.idUsuario)
      .then(() => {
        this.obtenerNotasCita();
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  descargarCita() {
    this.cargando = true;
    this.citaSolicitudService.descargarCita(this.citaSolicitud.idCita, this.usuario.idUsuario).then(response => {
      this.utilService.saveByteArray("schedule_file-" + this.citaSolicitud.idSolicitud + "_" + this.citaSolicitud.idCita, response, 'pdf');
    }).catch(e => this.utilService.manejarError(e))
    .finally(() => this.cargando = false);
  }

  obtenerNotasCita() {
    this.cargando = true;
    this.notaCitaService
      .obtenerNotasCita(this.citaSolicitud.idCita)
      .then(notas => {
        this.arrNotasCita = notas;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  agregarNota() {
    this.cargando = true;
    this.notaCitaService
      .guardarNota(this.nuevaNotaCita)
      .then(() => {
        this.obtenerNotasCita();
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  obtenerSolicitudesActivasUsuario() {
    this.cargando = true;
    this.solicitudesVOCService
      .obtenerSolicitudesActivasUsuario(this.usuario.idUsuario)
      .then(solicitudes => {
        this.arrSolicitudesVoc = solicitudes;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
