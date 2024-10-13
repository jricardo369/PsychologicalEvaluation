import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MovimientoSolicitudService } from 'src/app/services/movimiento-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { ReporteMovimientos } from 'src/model/reporte-movimientos';
import { Usuario } from 'src/model/usuario';
import { DialogoDetalleMovimientosComponent } from '../dialogo-detalle-movimientos/dialogo-detalle-movimientos.component';

@Component({
  selector: 'app-reporte-movimientos-usuario',
  templateUrl: './reporte-movimientos-usuario.component.html',
  styleUrls: ['./reporte-movimientos-usuario.component.css']
})
export class ReporteMovimientosUsuarioComponent implements OnInit {

  cargando: boolean = false;
  usuario: Usuario = new Usuario();

  reporteMovimientos: ReporteMovimientos = new ReporteMovimientos;
  fechaF: string;
  fechaI: string = '2020-01-01';
  inputCliente: string = "";
  inputTipoReporte: string = "1";

  constructor(
    private movimientoSolicitudService: MovimientoSolicitudService,
    public utilService: UtilService,
    private dialog: MatDialog
  ) {
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
    var today = new Date().toISOString();
    this.fechaF = today.split('T', 1)[0];

    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.fechaI = ((date.toISOString()).split('T', 1))[0];

    this.obtenerMovimientosUsuario();
  }

  ngOnInit(): void {
  }

  obtenerMovimientosUsuario() {
    let servicio: Promise<ReporteMovimientos> = null;
    switch (this.inputTipoReporte) {
      case "1":
        servicio = this.movimientoSolicitudService.obtenerReporteAdeudos(this.inputCliente, this.fechaI, this.fechaF, this.usuario.idUsuario);
        break;
      case "2":
        servicio = this.movimientoSolicitudService.obtenerReporteMovimientos(this.inputCliente, this.fechaI, this.fechaF);
        break;
      default:
        break;
    }
    this.cargando = true;
    servicio
      .then((reporteMovimientos) => {
        this.reporteMovimientos = reporteMovimientos;
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  abrirDetalle(idSolicitud: number) {
    this.dialog.open(DialogoDetalleMovimientosComponent, {
      data: {
        idSolicitud: idSolicitud
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      //if (valor == 'enviado') this.goBack();
    }).catch(reason => this.utilService.manejarError(reason));
  }
}
