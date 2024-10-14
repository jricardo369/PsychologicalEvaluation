import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { UtilService } from 'src/app/services/util.service';
import { ReporteCorreosEnviados } from 'src/model/reporte-correos-enviados';
import { PaginationManager } from 'src/util/pagination';
import { DialogoNotificacionesComponent } from '../dialogo-notificaciones/dialogo-notificaciones.component';
import { MatDialog } from '@angular/material/dialog';
import { Usuario } from 'src/model/usuario';

@Component({
  selector: 'app-envio-correos-abogados',
  templateUrl: './envio-correos-abogados.component.html',
  styleUrls: ['./envio-correos-abogados.component.css']
})
export class EnvioCorreosAbogadosComponent implements OnInit {

  cargando: boolean = false;
  usuario: Usuario = new Usuario();

  arrReporteCorreosEnviados: ReporteCorreosEnviados[] = [];
  paginacion: PaginationManager = new PaginationManager();
  fechaF: string;
  fechaI: string = '2020-01-01';

  seleccion: number[] = [];

  constructor(
    private reportesService: ReportesService,
    public utilService: UtilService,
    private dialog: MatDialog
  ) {
    var today = new Date().toISOString();
    this.fechaF = today.split('T', 1)[0];
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));

    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.fechaI = ((date.toISOString()).split('T', 1))[0];

    this.obtenerCorreosEnviados();
  }

  ngOnInit(): void {
  }

  obtenerCorreosEnviados() {
    this.cargando = true;
    this.reportesService.obtenerCorreosEnviados(this.fechaI, this.fechaF)
      .then((reporteCorreosEnviados) => {
        this.arrReporteCorreosEnviados = reporteCorreosEnviados;
        this.paginacion.setArray(this.arrReporteCorreosEnviados);
        this.seleccion = [];
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  estanTodosSeleccionados() {
    return this.seleccion.length == this.arrReporteCorreosEnviados.length;
  }

  checkAll() {
    if (this.estanTodosSeleccionados()) this.seleccion = [];
    else {
      this.seleccion = [];
      this.arrReporteCorreosEnviados.forEach(u => this.seleccion.push(u.idUsuario));
    }
  }

  estaSeleccionado(id: number) {
    return this.seleccion.find(e => e == id) != null;
  }

  check(event: Event, id: number) {
    if ((event.srcElement as HTMLInputElement).checked) {
      //add
      if (!this.estaSeleccionado(id)) this.seleccion.push(id);
    } else {
      //remove
      if (this.estaSeleccionado(id)) this.seleccion.splice(this.seleccion.indexOf(id), 1);
    }
  }

  enviarNotificaciones() {
    let firmasAbogados: string = "";
    this.arrReporteCorreosEnviados.forEach(u => {
      if (this.seleccion.includes(u.idUsuario)) {
        firmasAbogados += (firmasAbogados.length > 0) ? (',' + u.nombre) : u.nombre;
      }
    });

    this.dialog.open(DialogoNotificacionesComponent, {
      data: {
        usuario: this.usuario,
        firmasAbogados: firmasAbogados
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      //if (valor == 'enviado') this.refreshEventosSolicitud();
    }).catch(reason => this.utilService.manejarError(reason));
  }
}
