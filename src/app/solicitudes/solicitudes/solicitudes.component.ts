import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRATOR, BACKOFFICE, INTERVIEWER, MASTER, TEMPLATE_CREATOR, VENDOR, VOC } from 'src/app/app.config';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { Filter, UtilService } from 'src/app/services/util.service';
import { Solicitud } from 'src/model/solicitud';
import { SolicitudList } from 'src/model/solicitud-list';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';

@Component({
	selector: 'app-solicitudes',
	templateUrl: './solicitudes.component.html',
	styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

	cargando: boolean = false;

	mostrandoResultadosFiltrados = false;
	filters: Filter[] = [];
	solicitudes: SolicitudList[] = [];
	solicitudesSinFiltrar: SolicitudList[] = [];
	seleccion: number[] = [];

	usuario: Usuario = new Usuario;

	paginacion: PaginationManager = new PaginationManager();

	isAdministrator: boolean = false;
	isMaster: boolean = false;
	isVendor: boolean = false;
	isBackOffice: boolean = false;
	isInterviewer: boolean = false;
	isVOC: boolean = false;
	isTemplateCreator: boolean = false;

	constructor(
		private router: Router,
		private solicitudesService: SolicitudesService,
		public utilService: UtilService
	) {
		this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
		this.isAdministrator = this.usuario.rol == ADMINISTRATOR ? true : false;
		this.isMaster = this.usuario.rol == MASTER ? true : false;
		this.isVendor = this.usuario.rol == VENDOR ? true : false;
		this.isBackOffice = this.usuario.rol == BACKOFFICE ? true : false;
		this.isInterviewer = this.usuario.rol == INTERVIEWER ? true : false;
		this.isVOC = this.usuario.rol == VOC ? true : false;
		this.isTemplateCreator = this.usuario.rol == TEMPLATE_CREATOR ? true : false;
	}

	ngOnInit(): void {
    this.refrescar();
	}

	refrescar() {
		this.cargando = true;
		this.solicitudesService
			.obtenerSolicitudesUsuario(this.usuario.idUsuario)
			.then(solicitudes => {
				this.solicitudesSinFiltrar = solicitudes;
				this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
				this.paginacion.setArray(this.solicitudes);
        this.limpiarFiltros();
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false)
	}

  showClosedRequests() {
		this.cargando = true;
		this.solicitudesService
			.obtenerSolicitudesUsuarioCerradas(this.usuario.idUsuario)
			.then(solicitudes => {
				this.solicitudesSinFiltrar = solicitudes;
				this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
				this.paginacion.setArray(this.solicitudes);
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false)
	}

	estanTodosSeleccionados() {
		return this.seleccion.length == this.solicitudes.length;
	}

	checkAll(event: Event, id: string) {
		if (this.estanTodosSeleccionados()) this.seleccion = [];
		else {
			this.seleccion = [];
			this.solicitudes.forEach(u => this.seleccion.push(u.idSolicitud));
		}
	}

	estaSeleccionado(id: number) {
		return this.seleccion.find(e => e == id) != null;
	}

	check(event: Event, id: number) {
		if ((event.srcElement as HTMLInputElement).checked) {
			//add
			if (!this.estaSeleccionado(id)) this.seleccion.push(id);
		} else {
			//remove
			if (this.estaSeleccionado(id)) this.seleccion.splice(this.seleccion.indexOf(id), 1);
		}
	}

	agregarFiltro() {
		this.filters.push(new Filter());
	}

	eliminarFiltro(f: Filter) {
		let start = this.filters.indexOf(f);
		let deleteCount = 1;
		this.filters.splice(start, deleteCount);
		if (this.filters.length == 0)
			this.aplicarFiltros();
	}

	limpiarFiltros() {
		this.filters = [];
		this.aplicarFiltros();
	}

	aplicarFiltros() {
		let filtered = [];
		u: for (let i = 0; i < this.solicitudesSinFiltrar.length; i++) {
			let r = this.solicitudesSinFiltrar[i];
			for (let j = 0; j < this.filters.length; j++) {
				let f = this.filters[j];

				let v = null;

				switch (f.campo) {
					case 'file': v = r.idSolicitud; break;
					case 'creationDate': v = r.fechaInicio; break;
					case 'asignado': v = r.abogado; break;
					case 'cliente': v = r.cliente; break;
					case 'telefono': v = r.telefono; break;
					case 'tipoSolicitud': v = r.tipoSolicitud; break;
					case 'edad': v = r.age; break;
					case 'email': v = r.email; break;
					case 'importancia': v = r.importante; break;
					case 'estatusPago': v = r.estatusPago; break;
					case 'estatusSolicitud': v = r.estatusSolicitud; break;
					case 'horario': v = r.fecha_schedule; break;
				}

				switch (f.operador) {
					case "!=": if (!(v != f.valor)) continue u; break;
					case "==": if (!(v == f.valor)) continue u; break;
					case ">=": if (!(v >= f.valor)) continue u; break;
					case "<=": if (!(v <= f.valor)) continue u; break;
					case ">": if (!(v > f.valor)) continue u; break;
					case "<": if (!(v < f.valor)) continue u; break;
					case "startsWith": if (!(('' + v).toLowerCase().startsWith(('' + f.valor).toLowerCase()))) continue u; break;
					case "endsWith": if (!(('' + v).toLowerCase().endsWith(('' + f.valor).toLowerCase()))) continue u; break;
					case "includes": if (!(('' + v).toLowerCase().includes(('' + f.valor).toLowerCase()))) continue u; break;
				}

			}
			filtered.push(r);
		};
		this.solicitudes = filtered;
		this.solicitudes.sort((a, b) => b.idSolicitud - a.idSolicitud);
		this.paginacion.setArray(this.solicitudes);
	}

	crearSolicitud() { this.router.navigateByUrl('/solicitudes/solicitudes/nueva-solicitud'); }
}
