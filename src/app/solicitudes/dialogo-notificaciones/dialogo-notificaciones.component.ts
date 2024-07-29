import { NotificacionesService } from './../../services/notificaciones.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { Notificacion } from 'src/model/notificacion';

@Component({
    selector: 'app-dialogo-notificaciones',
    templateUrl: './dialogo-notificaciones.component.html',
    styleUrls: ['./dialogo-notificaciones.component.css']
})
export class DialogoNotificacionesComponent implements OnInit {

    cargando: boolean = false;

    notificacion: Notificacion = new Notificacion;
    idSolicitud: number = null;
    idUsuario: number = null;

    public fileNotificacion: File[] = [];

    constructor(
        private notificacionesService: NotificacionesService,
        public utilService: UtilService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogoNotificacionesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.notificacion.idSolicitud = data.idSolicitud;
        this.notificacion.usuario = data.idUsuario;
        this.notificacion.titulo = "";
        this.notificacion.cuerpo = "";
        this.notificacion.layout = "";
    }

    ngOnInit(): void {
        this.notificacion.mail = true;
        this.notificacion.mensaje = false;
    }

    onFileSelected(files: FileList) {
        // this.file[0] = files.length && files.item(0).type.startsWith('image/') ? files.item(0) : null;
        for (let i = 0; i < files.length; i++) {
            this.fileNotificacion.push(files.item(i));
        }
    }

    quitarAdjunto(archivo: File) {
        let start = this.fileNotificacion.findIndex(f => f == archivo);
        this.fileNotificacion.splice(start, 1);
    }

    enviar() {
        this.cargando = true;
        this.notificacionesService.enviarNotificacion(this.notificacion, this.fileNotificacion[0])
        .then(() => {
          this.cargando = false;
          this.cerrar('enviado');
        })
        .catch((reason) => this.utilService.manejarError(reason))
        .then(() => (this.cargando = false));
    }

    changeLayout() {
      this.notificacion.titulo = "";
      this.notificacion.cuerpo = "";
      this.fileNotificacion = [];
    }

    cerrar(accion: string = "") { this.dialogRef.close(accion); }
}
