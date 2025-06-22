import { Component, Input, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';
import { DialogoCitaSolicitudComponent } from '../dialogo-cita-solicitud/dialogo-cita-solicitud.component';
import { SolicitudVocComponent } from '../solicitud-voc/solicitud-voc.component';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';

@Component({
  selector: 'app-citas-solicitud',
  templateUrl: './citas-solicitud.component.html',
  styleUrls: ['./citas-solicitud.component.css']
})
export class CitasSolicitudComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() idUsuario: number;

  mostrarCitas: boolean = true;
  arrCitaSolicitud: CitaSolicitud[] = [];
  paginacion: PaginationManager = new PaginationManager();

  cargando: boolean = false;
  usuario: Usuario = new Usuario();

  constructor(
    private citaSolicitudService: CitaSolicitudService,
    private utilService: UtilService,
    private dialog: MatDialog,
    @Optional() public parent: SolicitudVocComponent) {
    this.mostrarCitas = true;
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
  }

  ngOnInit(): void {
    this.refresh();
    this.mostrarCitas = true;
  }


  refresh() {
    this.cargando = true;
    this.citaSolicitudService
      .obtenerCitasSolicitud(Number.parseInt(this.idSolicitud))
      .then(response => {
        this.arrCitaSolicitud = response;
        this.paginacion.setArray(this.arrCitaSolicitud,10);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  crearCita() {
    this.dialog.open(DialogoCitaSolicitudComponent, {
      data: {
        idSolicitud: this.idSolicitud,
        creando: true,
        verCampoSolicitud: false
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'creado') { this.refresh(); this.parent.obtenerSolicitud(parseInt(this.idSolicitud)) };
    }).catch(reason => this.utilService.manejarError(reason));
  }

  verCita(cita: CitaSolicitud) {
    this.dialog.open(DialogoCitaSolicitudComponent, {
      data: {
        idSolicitud: this.idSolicitud,
        creando: false,
        verCampoSolicitud: false,
        citaSolicitud: cita
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      // if (valor == 'creado') this.refresh();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  no_show(cita: CitaSolicitud) {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'No-show',
        texto: 'Do you really want to mark your appointment as a No show"?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.citaSolicitudService
          .no_show(cita.idCita, this.usuario.idUsuario)
          .then(() => { this.refresh(); this.parent.obtenerSolicitud(parseInt(this.idSolicitud)) })
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => this.cargando = false);
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }
}
