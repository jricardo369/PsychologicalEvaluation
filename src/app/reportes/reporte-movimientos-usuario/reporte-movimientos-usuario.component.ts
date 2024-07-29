import { Component, OnInit } from '@angular/core';
import { MovimientoSolicitudService } from 'src/app/services/movimiento-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { ReporteMovimientos } from 'src/model/reporte-movimientos';

@Component({
  selector: 'app-reporte-movimientos-usuario',
  templateUrl: './reporte-movimientos-usuario.component.html',
  styleUrls: ['./reporte-movimientos-usuario.component.css']
})
export class ReporteMovimientosUsuarioComponent implements OnInit {

  cargando: boolean = false;

  reporteMovimientos: ReporteMovimientos = new ReporteMovimientos;
  fechaF: string;
  fechaI: string = '2020-01-01';
  inputCliente: string = "";

  constructor(
    private movimientoSolicitudService: MovimientoSolicitudService,
    public utilService: UtilService
  ) {
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
    console.log(this.inputCliente)
      this.cargando = true;
      this.movimientoSolicitudService.obtenerReporteMovimientos(this.inputCliente, this.fechaI, this.fechaF)
        .then((reporteMovimientos) => {
          this.reporteMovimientos = reporteMovimientos;
        })
        .catch((reason) => this.utilService.manejarError(reason))
        .then(() => (this.cargando = false));
  }
}
