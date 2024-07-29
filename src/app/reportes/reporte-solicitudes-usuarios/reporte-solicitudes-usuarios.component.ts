import { ReportesService } from './../../services/reportes.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ReporteSolicitudesUsuarios } from 'src/model/reporte-solicitudes-usuarios';

@Component({
    selector: 'app-reporte-solicitudes-usuarios',
    templateUrl: './reporte-solicitudes-usuarios.component.html',
    styleUrls: ['./reporte-solicitudes-usuarios.component.css']
})
export class ReporteSolicitudesUsuariosComponent implements OnInit {

    cargando: boolean = false;

    arrReporteSolicitudesUsuarios: ReporteSolicitudesUsuarios[] = [];
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

        this.obtenerSolicitudesUsuarios();
    }

    ngOnInit(): void {
    }
    obtenerSolicitudesUsuarios() {
        this.cargando = true;
        this.reportesService.obtenerUsersRequests(this.fechaI, this.fechaF)
            .then((reporteSolicitudesUsuarios) => {
                this.arrReporteSolicitudesUsuarios = reporteSolicitudesUsuarios;
            })
            .catch((reason) => this.utilService.manejarError(reason))
            .then(() => (this.cargando = false));
    }

}
