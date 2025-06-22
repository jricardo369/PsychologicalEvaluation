import { ReportesService } from './../../services/reportes.service';
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ReporteSolicitudesUsuarios } from 'src/model/reporte-solicitudes-usuarios';
import { PaginationManager } from 'src/util/pagination';
import { DialogoSolicitudesUsuarioComponent } from "src/app/reportes/dialogo-solicitudes-usuario/dialogo-solicitudes-usuario.component";
import { MatDialog } from "@angular/material/dialog";
import { Usuario } from 'src/model/usuario';

@Component({
    selector: 'app-reporte-solicitudes-usuarios',
    templateUrl: './reporte-solicitudes-usuarios.component.html',
    styleUrls: ['./reporte-solicitudes-usuarios.component.css']
})
export class ReporteSolicitudesUsuariosComponent implements OnInit {

    cargando: boolean = false;

    arrReporteSolicitudesUsuarios: ReporteSolicitudesUsuarios[] = [];
    paginacion: PaginationManager = new PaginationManager();
    fechaF: string;
    fechaI: string = '2020-01-01';
    usuario: Usuario = new Usuario();
    baseHref = document.baseURI;
    imageUsuario: string = this.baseHref+'assets/svg/avatar.svg';

    constructor(
        private dialog: MatDialog,
        private reportesService: ReportesService,
        public utilService: UtilService

    ) {

        this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
        var today = new Date().toISOString();
        this.fechaF = today.split('T', 1)[0];

        var date = new Date();
        date.setMonth(date.getMonth() - 1);
        this.fechaI = ((date.toISOString()).split('T', 1))[0];

        this.obtenerSolicitudesUsuarios();
    }

    ngOnInit(): void {
        console.log('inicio');
    }
    obtenerSolicitudesUsuarios() {
        this.cargando = true;
        this.reportesService.obtenerUsersRequests(this.fechaI, this.fechaF,this.usuario.idUsuario)
            .then((reporteSolicitudesUsuarios) => {
                this.arrReporteSolicitudesUsuarios = reporteSolicitudesUsuarios;
                this.paginacion.setArray(this.arrReporteSolicitudesUsuarios,20);
            })
            .catch((reason) => this.utilService.manejarError(reason))
            .then(() => (this.cargando = false));
    }

    verSolicitudesUsuario(idUsuario: number,nombre: string){
        if(!nombre.includes("Teraphist")){
        this.dialog.open(DialogoSolicitudesUsuarioComponent, {
                data: {
                  idUsuario: idUsuario,
                  fechaI: this.fechaI,
                  fechaF: this.fechaF
                },
                disableClose: true,
              }).afterClosed().toPromise().then(valor => {
                if (valor == 'vacio') this.utilService.mostrarDialogoSimple("Warning", "No files were found with this user.");
              }).catch(reason => this.utilService.manejarError(reason));
            }
    }

}
