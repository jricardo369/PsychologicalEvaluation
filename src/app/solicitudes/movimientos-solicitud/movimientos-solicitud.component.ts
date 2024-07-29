import { Component, Input, OnInit, Optional } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MovimientoSolicitudService } from 'src/app/services/movimiento-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { MovimientoSolicitud } from 'src/model/movimiento-solicitud';
import { DialogoMovimientoSolicitudComponent } from '../dialogo-movimiento-solicitud/dialogo-movimiento-solicitud.component';
import { SolicitudComponent } from '../solicitud/solicitud.component';

@Component({
	selector: 'app-movimientos-solicitud',
	templateUrl: './movimientos-solicitud.component.html',
	styleUrls: ['./movimientos-solicitud.component.css']
})
export class MovimientosSolicitudComponent implements OnInit {

	@Input() idSolicitud: string;
	@Input() idUsuario: number;
  @Input() idEstatusSolicitud: number;

	mostrarMovimientos: boolean = true;
	arrMovimientoSolicitud: MovimientoSolicitud[] = [];

	cargando: boolean = false;

	constructor(
		private movimientoSolicitudService: MovimientoSolicitudService,
		private utilService: UtilService,
		private dialog: MatDialog,
    @Optional() public parent: SolicitudComponent) {
		this.mostrarMovimientos = true;
	}

	ngOnInit(): void {
		this.refresh();
		this.mostrarMovimientos = true;
	}


	refresh() {
		this.cargando = true;
		this.movimientoSolicitudService
			.obtenerMovimientosSolicitud(Number.parseInt(this.idSolicitud))
			.then(response => {
				this.arrMovimientoSolicitud = response;
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false)
	}

	agregarMovimiento() {
		this.dialog.open(DialogoMovimientoSolicitudComponent, {
			data: {
				idSolicitud: this.idSolicitud,
        idUsuario: this.idUsuario
			},
			disableClose: true,
		}).afterClosed().toPromise().then(valor => {
			if (valor == 'creado') {this.refresh(); this.parent.obtenerSolicitud(parseInt(this.idSolicitud))};
		}).catch(reason => this.utilService.manejarError(reason));
	}

}
