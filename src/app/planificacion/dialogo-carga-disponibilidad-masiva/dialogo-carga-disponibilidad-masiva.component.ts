import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DisponibilidadUsuariosService } from 'src/app/services/disponibilidad-usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { Usuario } from 'src/model/usuario';

@Component({
  selector: 'app-dialogo-carga-disponibilidad-masiva',
  templateUrl: './dialogo-carga-disponibilidad-masiva.component.html',
  styleUrls: ['./dialogo-carga-disponibilidad-masiva.component.css']
})
export class DialogoCargaDisponibilidadMasivaComponent implements OnInit {

  cargando: boolean = false;
  usuario: Usuario = new Usuario;
  public file: File[] = [];

  constructor(
    private disponibilidadUsuariosService: DisponibilidadUsuariosService,
    public utilService: UtilService,
		private dialog: MatDialog,
		public dialogRef: MatDialogRef<DialogoCargaDisponibilidadMasivaComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
	}

  ngOnInit(): void {
  }

  onFileSelected(files: FileList) {
		for (let i = 0; i < files.length; i++) {
			this.file.push(files.item(i));
		}
	}

  enviar() {
		this.cargando = true;
		this.disponibilidadUsuariosService.cargarDisponibilidadMasiva(this.usuario.idUsuario, this.file[0])
			.then(() => {
				this.cerrar('cargada');
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false);
	}

	cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
