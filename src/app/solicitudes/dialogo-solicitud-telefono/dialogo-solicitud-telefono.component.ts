import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { UtilService } from 'src/app/services/util.service';
import { SolicitudTelefono } from 'src/model/solicitud-telefono';
import { PaginationManager } from 'src/util/pagination';

@Component({
  selector: 'app-dialogo-solicitud-telefono',
  templateUrl: './dialogo-solicitud-telefono.component.html',
  styleUrls: ['./dialogo-solicitud-telefono.component.css']
})
export class DialogoSolicitudTelefonoComponent implements OnInit {

  cargando: boolean = false;
  telefono: string = "";
  arrSolicitudTelefono: SolicitudTelefono[] = [];
  paginacion: PaginationManager = new PaginationManager();

  constructor(private solicitudesService: SolicitudesService,
    public utilService: UtilService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DialogoSolicitudTelefonoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.telefono = data.telefono;
      this.obtenerSolicitudesDeTelefono();
    }

  ngOnInit(): void {
  }

  obtenerSolicitudesDeTelefono() {
    this.cargando = true;
    this.solicitudesService.obtenerSolicitudesDeTelefono(this.telefono.replace(/\D/g, ''))
      .then((solicitudTelefono) => {
        this.arrSolicitudTelefono = solicitudTelefono;
        if(!(this.arrSolicitudTelefono.length > 0)) {
          this.cerrar("vacio");
        }
        this.paginacion.setArray(this.arrSolicitudTelefono);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
