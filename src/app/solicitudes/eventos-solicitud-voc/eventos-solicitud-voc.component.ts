import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';
import { EventoSolicitudVocService } from 'src/app/services/evento-solicitud-voc.service';
import { DialogoEventoSolicitudVocComponent } from '../dialogo-evento-solicitud-voc/dialogo-evento-solicitud-voc.component';

@Component({
  selector: 'app-eventos-solicitud-voc',
  templateUrl: './eventos-solicitud-voc.component.html',
  styleUrls: ['./eventos-solicitud-voc.component.css']
})
export class EventosSolicitudVocComponent implements OnInit {

  @Input() idSolicitud: string;
  @Input() idEstatusSolicitud: number;

  mostrarEventos: boolean = true;
  arrEventoSolicitud: EventoSolicitud[] = [];
  paginacion: PaginationManager = new PaginationManager();

  cargando: boolean = false;
  usuario: Usuario = new Usuario();

  constructor(
      private eventoSolicitudVocService: EventoSolicitudVocService,
      private utilService: UtilService,
      private dialog: MatDialog) {
      this.mostrarEventos = true;
      this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
  }

  ngOnInit(): void {
      this.refresh();
      this.mostrarEventos = true;
  }


  refresh() {
      this.cargando = true;
      this.eventoSolicitudVocService
          .obtenerEventosSolicitud(Number.parseInt(this.idSolicitud), this.usuario.idUsuario)
          .then(response => {
              this.arrEventoSolicitud = response;
              this.paginacion.setArray(this.arrEventoSolicitud);
          })
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => this.cargando = false)
  }

  crearEvento() {
      this.dialog.open(DialogoEventoSolicitudVocComponent, {
          data: {
              idSolicitud: this.idSolicitud
          },
          disableClose: true,
      }).afterClosed().toPromise().then(valor => {
          if (valor == 'creado') this.refresh();
      }).catch(reason => this.utilService.manejarError(reason));
  }
}
