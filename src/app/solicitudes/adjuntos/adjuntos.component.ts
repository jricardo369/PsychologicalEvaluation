import { Component, Input, OnInit, Optional } from '@angular/core';
import { AdjuntosService } from 'src/app/services/adjuntos.service';
import { EventoSolicitudService } from 'src/app/services/evento-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { Adjunto } from 'src/model/adjunto';
import { SolicitudComponent } from '../solicitud/solicitud.component';

@Component({
	selector: 'app-adjuntos',
	templateUrl: './adjuntos.component.html',
	styleUrls: ['./adjuntos.component.css']
})
export class AdjuntosComponent implements OnInit {

	@Input() idSolicitud: string;
	@Input() idUsuario: number;
  @Input() idEstatusSolicitud: number;

	mostrarAdjuntos: boolean = true;
	arrAdjunto: Adjunto[] = [];

	cargando: boolean = false;

	public file: File[] = [];

	constructor(private adjuntosService: AdjuntosService, private utilService: UtilService,
    @Optional() public parent: SolicitudComponent) {
		this.mostrarAdjuntos = true;
	}

	ngOnInit(): void {
		this.refresh();
		this.mostrarAdjuntos = true;
	}


	refresh() {
		this.cargando = true;
		this.adjuntosService.obtenerAdjuntosSolicitud(Number.parseInt(this.idSolicitud))
			.then(response => {
				this.arrAdjunto = response;
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false)
	}

	onFileSelected(files: FileList) {
		// this.file[0] = files.length && files.item(0).type.startsWith('image/') ? files.item(0) : null;
		for (let i = 0; i < files.length; i++) {
			this.file.push(files.item(i));
		}
	}

	quitarAdjunto(archivo: File) {
		let start = this.file.findIndex(f => f == archivo);
		this.file.splice(start, 1);
	}

	abrirAdjunto(adjunto: Adjunto) {
		window.open(adjunto.urlImagen, '_blank');
	}

	descargarAdjunto(adjunto: Adjunto) {
		let link = window.document.createElement('a');
		link.href = adjunto.urlImagen;
    link.target = '_blank';
		link.download = adjunto.nombre;
		link.click();
	}

	eliminarAdjunto(adjunto: Adjunto) {
		this.cargando = true;
		this.adjuntosService
			.eliminarAdjunto(adjunto.idImagen, this.idUsuario)
			.then(() => {
				this.refresh();
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false);
	}

	cargarAdjunto() {
		let promises = [];
		this.file.forEach(f => promises.push(this.adjuntosService.insertarAdjunto(Number.parseInt(this.idSolicitud), f, this.idUsuario)));

		this.cargando = true;
		Promise
			.all(promises)
			.then(results => {
				console.log(results);
				this.file = [];
				this.refresh();
        this.parent.refreshEventosSolicitud();
			}).catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false);
	}
}
