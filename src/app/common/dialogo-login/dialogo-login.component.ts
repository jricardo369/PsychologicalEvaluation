import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Inject, Component, ViewChild } from "@angular/core";
import { UtilService } from "src/app/services/util.service";
import { SessionService } from "src/app/services/session.service";
import { Router } from "@angular/router";

@Component({
    selector: 'dialogo-login',
    templateUrl: 'dialogo-login.component.html',
    styleUrls: ['./dialogo-login.component.scss']
})
export class DialogoLoginComponent {

    recuperarPasswordOnly = false;

    constructor(
        public utilService: UtilService,
        private sessionService: SessionService,
        private router: Router,
        public dialogRef: MatDialogRef<DialogoLoginComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.recuperarPasswordOnly = data.recuperarPasswordOnly;
    }

    cerrar() { this.dialogRef.close(); }

    salir() {
        this.cerrar();
        this.utilService.limpiarContadorDeSesion();
        this.sessionService.cerrarSesion();
        this.router.navigate(['/ingresar']);
    }
}