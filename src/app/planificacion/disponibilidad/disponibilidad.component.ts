import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DisponibilidadUsuariosService } from 'src/app/services/disponibilidad-usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { DisponibilidadUsuario } from 'src/model/disponibilidad-usuario';
import { Usuario } from 'src/model/usuario';
import { DialogoDisponibilidadUsuarioComponent } from '../dialogo-disponibilidad-usuario/dialogo-disponibilidad-usuario.component';
import { PaginationManager } from 'src/util/pagination';
import { DialogoCargaDisponibilidadMasivaComponent } from '../dialogo-carga-disponibilidad-masiva/dialogo-carga-disponibilidad-masiva.component';

@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.css']
})
export class DisponibilidadComponent implements OnInit {

  cargando: boolean = false;

  arrDisponibilidadUsuario: DisponibilidadUsuario[] = [];
  paginacion: PaginationManager = new PaginationManager();

  usuario: Usuario = new Usuario;

  constructor(
    private disponibilidadUsuariosService: DisponibilidadUsuariosService,
    public utilService: UtilService,
    private dialog: MatDialog) {
    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
    this.obtenerDisponibilidadUsuario();
  }

  ngOnInit(): void {
  }

  obtenerDisponibilidadUsuario() {
    this.cargando = true;
    this.disponibilidadUsuariosService.obtenerDisponibilidadUsuario(this.usuario.idUsuario)
      .then((disponibilidadUsuarios) => {
        this.arrDisponibilidadUsuario = disponibilidadUsuarios;
        this.paginacion.setArray(this.arrDisponibilidadUsuario,10);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  agregarDisponibilidad() {
    this.dialog.open(DialogoDisponibilidadUsuarioComponent, {
      data: {},
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'agregada') this.obtenerDisponibilidadUsuario();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  agregarDisponibilidadMasiva() {
    this.dialog.open(DialogoCargaDisponibilidadMasivaComponent, {
      data: {},
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'cargada') this.obtenerDisponibilidadUsuario();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  eliminarDisponibilidad(disponibilidadUsuario: DisponibilidadUsuario) {
    this.cargando = true;
    this.disponibilidadUsuariosService.eliminarDisponibilidadUsuario(disponibilidadUsuario.idDisponibilidad)
      .then(() => {
        this.obtenerDisponibilidadUsuario();
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  descargarLayout() {
    this.cargando = true;
    this.disponibilidadUsuariosService.obtenerLayout()
      .then(response => {
        this.utilService.saveByteArray("layout", response, 'xlsx');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }
}
