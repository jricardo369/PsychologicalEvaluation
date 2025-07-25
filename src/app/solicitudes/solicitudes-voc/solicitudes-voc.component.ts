import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRATOR, BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, THERAPIST, VENDOR, VOC } from 'src/app/app.config';
import { EstatusPagoService } from 'src/app/services/estatus-pago.service';
import { EstatusSolicitudService } from 'src/app/services/estatus-solicitud.service';
import { SolicitudesVocService } from 'src/app/services/solicitudes-voc.service';
import { Filter, UtilService } from 'src/app/services/util.service';
import { EstatusPago } from 'src/model/estatus-pago';
import { EstatusSolicitud } from 'src/model/estatus-solicitud';
import { SolicitudVoc } from 'src/model/solicitud-voc';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { Filtros } from 'src/model/filtros';

@Component({
  selector: 'app-solicitudes-voc',
  templateUrl: './solicitudes-voc.component.html',
  styleUrls: ['./solicitudes-voc.component.css']
})
export class SolicitudesVocComponent implements OnInit {

  cargando: boolean = false;

  mostrandoResultadosFiltrados = false;
  solicitudes: SolicitudVoc[] = [];
  solicitudesSinFiltrar: SolicitudVoc[] = [];
  seleccion: number[] = [];

  usuario: Usuario = new Usuario;

  filtros: string = '';
    filtrosObj: Filtros = new Filtros;

  paginacion: PaginationManager = new PaginationManager();

  isAdministrator: boolean = false;
  isMaster: boolean = false;
  isVendor: boolean = false;
  isBackOffice: boolean = false;
  isInterviewer: boolean = false;
  isVOC: boolean = false;
  isTemplateCreator: boolean = false;
  isInterviewerScales: boolean = false;
  isGhostwriting: boolean = false;
  isTherapist: boolean = false;

  //arrFilterTypes: any[] = ["All", "File" , "Customer", "Case number", "Email", "Has document 2", "Payment Status", "File Status"];
  arrFilterTypes: string[] = [];
  arrFilterFileStatus: EstatusSolicitud[] = [{
    "idEstatusSolicitud": 0,
    "descripcion": "All"
  }];
  arrFilterStatusPago: EstatusPago[] = [{
    "idEstatusPago": 0,
    "descripcion": "All"
  }];
  arrFilterWaiver: any[] = [{
    "display": "All",
    "value": "All"
  }, {
    "display": "Yes",
    "value": "true"
  }, {
    "display": "No",
    "value": "false"
  }];

  filterSortBy: string = "";
  filterOrder: string = "";

  filterType: string = "All";
  arrFilterClosed: string[] = ['OPEN','CLOSED'];
  filterMyFiles: boolean = true;
  filterInputText: string = "";
  filterInputDate1: string = "";
  filterInputDate2: string = "";
  filterClosed: string = "OPEN";

  constructor(
    private solicitudesService: SolicitudesService,
    private router: Router,
    private solicitudesVOCService: SolicitudesVocService,
    private estatusSolicitudService: EstatusSolicitudService,
    private estatusPagoService: EstatusPagoService,
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
    this.isInterviewerScales = this.usuario.rol == INTERVIEWER_SCALES ? true : false;
    this.isGhostwriting = this.usuario.rol == GHOSTWRITING ? true : false;
    this.isTherapist = this.usuario.rol == THERAPIST ? true : false;
    this.obtenerEstatusSolicitudes();
    this.obtenerEstatusPagos();
    this.obtenerTextosTipoParaFiltros();
    this.clearInputs();
  }

  ngOnInit(): void {

    var date = new Date();

    let hoy: Date = new Date(Date.now());
    let primerDiadelMes: Date =  new Date();
    primerDiadelMes.setMonth(date.getMonth() - 8);
    primerDiadelMes.setDate(1);

    
    var today = new Date().toISOString();

    this.filterInputDate1 = this.utilService.dateAsYYYYMMDD(primerDiadelMes);
    this.filterInputDate2 = this.utilService.dateAsYYYYMMDD(hoy);
    //this.refrescar();

    //localStorage.setItem('filtros','');
     console.log('f:' + localStorage.getItem('filtros'));
     console.log('b:' + localStorage.getItem('backSolicitudVOC'));
 
     if (localStorage.getItem('backSolicitudVOC') != null) {
 
       if (localStorage.getItem('filtros') != null) {
 
         if (localStorage.getItem('filtros') !== '') {
 
           this.filtrosObj = JSON.parse(localStorage.getItem('filtros'));
           this.filterInputDate1 = this.filtrosObj.fechainicio;
           this.filterInputDate2 = this.filtrosObj.fechafin;
           this.filterSortBy = this.filtrosObj.sort;
           this.filterOrder = this.filtrosObj.order;
           this.filterType = this.filtrosObj.campo;
           this.filterInputText = this.filtrosObj.valor;
           this.filterMyFiles = this.filtrosObj.myfiles;
           this.filterClosed = this.filtrosObj.closed;
       
 
         }
       }
 
       if (localStorage.getItem('backSolicitudVOC') === '1') {
         localStorage.setItem('backSolicitudVOC', '');
         this.explorar();
         //this.filterType = 'All';
       } else {
         //this.limpiarFiltros();
         localStorage.setItem('filtros', '');
         this.filterInputDate1 =  ((primerDiadelMes.toISOString()).split('T', 1))[0];
         this.filterInputDate2 = ((date.toISOString()).split('T', 1))[0];
         this.filterClosed = "OPEN";
         this.filterType = 'All';
         this.refrescar();
       }
     } else {
       localStorage.setItem('backSolicitudVOC', '');
       this.filterInputDate1 = ((primerDiadelMes.toISOString()).split('T', 1))[0];
       this.filterInputDate2 = ((date.toISOString()).split('T', 1))[0];
       this.filterClosed = "OPEN";
       this.filterType = 'All';
 
       this.refrescar();
     }
  }

  limpiarFechas() {
    this.filterInputDate1 = "";
    this.filterInputDate2 = "";  
}

  @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        this.explorar();
      }
    }

  obtenerTextosTipoParaFiltros() {
    this.cargando = true;
    this.solicitudesService
      .obtenerTextosTipoParaFiltros(this.usuario.idUsuario)
      .then(textos => {
        this.arrFilterTypes = textos;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  obtenerEstatusSolicitudes() {
    this.cargando = true;
    this.estatusSolicitudService
      .obtenerEstatusSolicitudesDeUsuario(this.usuario.idUsuario)
      .then(estatusSolicitudes => {
        this.arrFilterFileStatus = estatusSolicitudes;
        this.arrFilterFileStatus = [{
          "idEstatusSolicitud": 0,
          "descripcion": "All"
        }].concat(this.arrFilterFileStatus);
        console.log(this.arrFilterFileStatus)
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  obtenerEstatusPagos() {
    this.cargando = true;
    this.estatusPagoService
      .obtenerEstatusPagos()
      .then(estatusPagos => {
        this.arrFilterStatusPago = estatusPagos;
        this.arrFilterStatusPago = [{
          "idEstatusPago": 0,
          "descripcion": "All"
        }].concat(this.arrFilterStatusPago);
        console.log(this.arrFilterStatusPago)
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  refrescar() {
    this.cargando = true;
    this.solicitudesVOCService
      .obtenerReporteSolicitudesFilters(this.usuario.idUsuario, this.filterType, this.filterInputText, this.filterInputDate1, this.filterInputDate2, this.filterMyFiles,this.filterInputDate1,this.filterInputDate2,this.filterClosed)
      .then(solicitudes => {
        this.solicitudesSinFiltrar = solicitudes;
        this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
        console.log(this.solicitudes)
        this.paginacion.setArray(this.solicitudes,20);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  showClosedRequests() {
    this.cargando = true;
    this.solicitudesVOCService
      .obtenerSolicitudesUsuarioCerradas(this.usuario.idUsuario)
      .then(solicitudes => {
        this.solicitudesSinFiltrar = solicitudes;
        this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
        this.paginacion.setArray(this.solicitudes,20);
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

  explorar() {
    this.cargando = true;
    this.solicitudesVOCService
      .obtenerReporteSolicitudesFilters(this.usuario.idUsuario, this.filterType, this.filterInputText, this.filterInputDate1, this.filterInputDate2, this.filterMyFiles,this.filterInputDate1,this.filterInputDate2,this.filterClosed)
      .then(solicitudes => {
        this.solicitudesSinFiltrar = solicitudes;
        this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
        this.paginacion.setArray(this.solicitudes,20);
        this.setearFiltros();
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  setearFiltros(){
    //this.filtros = this.filterStartDate +","+ this.filterEndDate +","+  this.filterSortBy+","+  this.filterOrder+","+  this.usuario.idUsuario+","+ this.filterType+","+  this.filterInputText+","+  this.filterMyFiles;
    this.filtros = "{ \"fechainicio\": \""+this.filterInputDate1+"\", \"fechafin\": \""+this.filterInputDate2+"\" , \"sort\": \""+this.filterSortBy+"\" , \"order\": \""+this.filterOrder+"\" , \"campo\": \""+this.filterType+"\" , \"valor\": \""+this.filterInputText+"\" , \"myfiles\": \""+this.filterMyFiles+"\", \"closed\": \""+this.filterClosed+"\"}";     
    console.log('filtros a guardar:'+this.filtros);
    localStorage.setItem('filtros', this.filtros);
  }

  clearInputs() {
    if (this.filterType == "All" || this.filterType == "File" || this.filterType == "Customer" || this.filterType == "Phone" || this.filterType == "Email" || this.filterType == "File Status" || this.filterType == "Payment Status" || this.filterType == "Responsible User" || this.filterType == "Waiver") {
      this.filterInputText = "";
      this.filterInputDate1 = "none";
      this.filterInputDate2 = "none";
    } else if (this.filterType == "Date") {
      this.filterInputText = "none";
      this.filterInputDate1 = "";
      this.filterInputDate2 = "";
    }
  }

  crearSolicitud() { this.router.navigateByUrl('/solicitudes/solicitudes-voc/nueva-solicitud'); }
}
