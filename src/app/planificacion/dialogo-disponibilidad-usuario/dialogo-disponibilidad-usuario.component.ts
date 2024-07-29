import { Usuario } from 'src/model/usuario';
import { DisponibilidadUsuario } from 'src/model/disponibilidad-usuario';
import { Component, Inject, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisponibilidadUsuariosService } from 'src/app/services/disponibilidad-usuarios.service';

@Component({
  selector: 'app-dialogo-disponibilidad-usuario',
  templateUrl: './dialogo-disponibilidad-usuario.component.html',
  styleUrls: ['./dialogo-disponibilidad-usuario.component.css']
})
export class DialogoDisponibilidadUsuarioComponent implements OnInit {

  cargando: boolean = false;
  disponibilidadUsuario: DisponibilidadUsuario = new DisponibilidadUsuario;
  usuario: Usuario = new Usuario;

  constructor(
    private disponibilidadUsuariosService: DisponibilidadUsuariosService,
    public utilService: UtilService,
		private dialog: MatDialog,
		public dialogRef: MatDialogRef<DialogoDisponibilidadUsuarioComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
	}

  ngOnInit(): void {
  }

  agregar() {
    this.disponibilidadUsuario.idUsuario = this.usuario.idUsuario;
    this.disponibilidadUsuario.nombreUsuario = this.usuario.nombre;
		this.cargando = true;
		this.disponibilidadUsuariosService.agregarDisponibilidadUsuario(this.disponibilidadUsuario)
			.then(() => {
				this.cerrar('agregada');
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false);
	}

	cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
