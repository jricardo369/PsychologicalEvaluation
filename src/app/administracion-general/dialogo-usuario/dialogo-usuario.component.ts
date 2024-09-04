import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { Usuario } from './../../../model/usuario';
import { Permiso } from './../../../model/permiso';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';

@Component({
  selector: 'app-dialogo-usuario',
  templateUrl: './dialogo-usuario.component.html',
  styleUrls: ['./dialogo-usuario.component.css']
})
export class DialogoUsuarioComponent implements OnInit {

  cargando: boolean = false;
  creando: boolean = false;
  titulo: string = 'Usuario';
  usuario: Usuario = new Usuario();
  permisos: Permiso[] = [];


  constructor(
    private usuariosService: UsuariosService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.permisos.push({ id: 1, nombre: "Send Notifications" });
    this.permisos.push({ id: 2, nombre: "Add Events" });
    this.permisos.push({ id: 3, nombre: "Add Payments" });
    this.permisos.push({ id: 4, nombre: "Edit requests" });
    if (data.idUsuario) {
      this.titulo = "Edit User"
      this.usuario.idUsuario = data.idUsuario;
      this.refrescar();
      this.creando = false;
    } else {
      this.titulo = "New User";
      this.creando = true;
      this.usuario.permisos = [];
    }
  }

  ngOnInit(): void {
  }

  estaSeleccionado(permiso: Permiso) {
    return this.usuario.permisos.find(p => p.id == permiso.id) != null;
  }

  checkAllPermisos(permisosUsuario: Permiso[]) {
    permisosUsuario.forEach(permiso => (<HTMLInputElement>document.getElementById(permiso.id.toString())).checked = true);
  }

  check(event: Event, permiso: Permiso) {
    if ((event.srcElement as HTMLInputElement).checked) {
      //add
      if (!this.estaSeleccionado(permiso)) this.usuario.permisos.push(permiso);
    } else {
      //remove
      if (this.estaSeleccionado(permiso)) this.usuario.permisos.splice(this.usuario.permisos.indexOf(permiso), 1);
    }
  }

  rolSelected() {
    //this.usuario.rol = this.usuario.rol == "5" ? this.usuario.rol : null;
  }

  refrescar() {
    this.cargando = true;
    this.usuariosService
      .obtenerUsuarioPorId(this.usuario.idUsuario)
      .then(usuario => {
        this.usuario = usuario;
        this.checkAllPermisos(this.usuario.permisos);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  crear() {
    this.usuario.estatus = "1";
    this.usuario.ausencia = false;
    console.log(this.usuario)
    this.cargando = true;
    this.usuariosService
      .insertarUsuario(this.usuario)
      .then(usuario => {
        this.cerrar('creado');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  editar() {
    this.cargando = true;
    this.usuariosService
      .editarUsuario(this.usuario)
      .then(usuario => {
        this.cerrar('editando');
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  eliminar() {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Delete user',
        texto: 'Do you really want to delete the user? Requests related to him will be deleted.',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Delete user', color: 'primary', valor: 'eliminar' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'eliminar') {
        this.cargando = true;
        this.usuariosService
          .eliminarUsuario(this.usuario.idUsuario)
          .then(usuario => {
            this.cerrar('editando');
          })
          .catch(reason => this.utilService.manejarError(reason))
          .then(() => this.cargando = false);
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
