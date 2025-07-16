import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { Usuario } from 'src/model/usuario';
import { Solicitud } from 'src/model/solicitud';
import { SolicitudList } from 'src/model/solicitud-list';
import { ReportesService } from 'src/app/services/reportes.service';
import { PaginationManager } from 'src/util/pagination';

interface Stats {
  activeFiles: number;
  completeFiles: number;
  canceledFiles: number;
  noShowFiles: number;
  refusedFiles: number;
}

@Component({
  selector: 'app-reporte-dashboard',
  templateUrl: './reporte-dashboard.component.html',
  styleUrls: ['./reporte-dashboard.component.css']
})
export class ReporteDashboardComponent implements OnInit {

  solicitudes: SolicitudList[] = [];
  solicitudesSinFiltrar: SolicitudList[] = [];
  paginacion: PaginationManager = new PaginationManager();

  stats: Stats | null = null;
  usuario: Usuario = new Usuario();
  cargando: boolean = false;
  arrFilterUsuarios: Usuario[] = [];
  usuarioAll: Usuario = new Usuario();
  filterUsuario: number = 0;
  fechaF: string;
  fechaI: string = '2020-01-01';

  constructor(
    private usuariosService: UsuariosService,
    public utilService: UtilService,
    private reportesService: ReportesService,
  ) {
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
    var today = new Date().toISOString();
    this.fechaF = today.split('T', 1)[0];

    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.fechaI = ((date.toISOString()).split('T', 1))[0];
    this.obtenerUsuarios();
    //this.obtenerDetalleSolicitudes();
  }

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    // Aquí iría tu lógica para cargar las estadísticas
    // Esto es solo un ejemplo con datos estáticos
    this.stats = {
      activeFiles: 25,
      completeFiles: 5,
      canceledFiles: 3,
      noShowFiles: 6,
      refusedFiles: 2
    };
  }

  obtenerUsuarios() {
    this.cargando = true;
    this.usuariosService
      .obtenerUsuariosParaCitas(this.usuario.idUsuario)
      .then(usuarios => {
        this.arrFilterUsuarios = usuarios;
        this.arrFilterUsuarios = [this.usuarioAll].concat(this.arrFilterUsuarios);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  obtenerDetalleSolicitudes() {

   console.log('usuarioselect:'+this.filterUsuario);

    this.cargando = true;
    this.reportesService
      .obtenerDetalleDashboard(this.fechaI,this.fechaF,this.usuario.idUsuario,this.usuario.idUsuario)
      .then(solicitudes => {
        this.solicitudesSinFiltrar = solicitudes;
        this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
        this.paginacion.setArray(this.solicitudes, 10);

      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

}
