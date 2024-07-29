import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { UtilService } from 'src/app/services/util.service';
import { ReporteCorreosEnviados } from 'src/model/reporte-correos-enviados';

@Component({
  selector: 'app-reporte-correos-enviados',
  templateUrl: './reporte-correos-enviados.component.html',
  styleUrls: ['./reporte-correos-enviados.component.css']
})
export class ReporteCorreosEnviadosComponent implements OnInit {

  cargando: boolean = false;

  arrReporteCorreosEnviados: ReporteCorreosEnviados[] = [];
  fechaF: string;
  fechaI: string = '2020-01-01';

  constructor(
    private reportesService: ReportesService,
    public utilService: UtilService
  ) {
    var today = new Date().toISOString();
    this.fechaF = today.split('T', 1)[0];

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
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

}
