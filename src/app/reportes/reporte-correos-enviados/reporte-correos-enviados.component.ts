import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/services/reportes.service';
import { UtilService } from 'src/app/services/util.service';
import { ReporteCorreosEnviados } from 'src/model/reporte-correos-enviados';
import { PaginationManager } from 'src/util/pagination';
import { DialogoFilesLawyerComponent } from "src/app/reportes/dialogo-files-lawyer/dialogo-files-lawyer.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-reporte-correos-enviados',
  templateUrl: './reporte-correos-enviados.component.html',
  styleUrls: ['./reporte-correos-enviados.component.css']
})
export class ReporteCorreosEnviadosComponent implements OnInit {

  cargando: boolean = false;

  arrReporteCorreosEnviados: ReporteCorreosEnviados[] = [];
  paginacion: PaginationManager = new PaginationManager();
  fechaF: string;
  fechaI: string = '2020-01-01';

  constructor(
    private dialog: MatDialog,
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
        this.paginacion.setArray(this.arrReporteCorreosEnviados,15);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

   descargarExcel() {
    this.cargando = true;
          this.reportesService.obtenerFilesFirmasAbogadosExcel(this.fechaI,this.fechaF)
            .subscribe(
              data =>{
                const file = new Blob([data], {type: 'application/vnd.ms-excel'});
                var fileUrl = URL.createObjectURL(file);
                let link: any = window.document.createElement('a');
                link.href = fileUrl;
                let aux = fileUrl.split('/');
                link.download = aux[aux.length -1]+".xlsx";
                link.click();
                this.cargando = false;
              }
            )
  }

  verSolicitudesLawyer(nombre: string){
          this.dialog.open(DialogoFilesLawyerComponent, {
                  data: {
                    nombre: nombre,
                    fechaI: this.fechaI,
                    fechaF: this.fechaF
                  },
                  disableClose: true,
                }).afterClosed().toPromise().then(valor => {
                  if (valor == 'vacio') this.utilService.mostrarDialogoSimple("Warning", "No files were found with this user.");
                }).catch(reason => this.utilService.manejarError(reason));
              
      }

}
