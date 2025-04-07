import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRATOR, BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, VENDOR, VOC } from 'src/app/app.config';
import { EstatusPagoService } from 'src/app/services/estatus-pago.service';
import { EstatusSolicitudService } from 'src/app/services/estatus-solicitud.service';
import { SolicitudesService } from 'src/app/services/solicitudes.service';
import { Filter, UtilService } from 'src/app/services/util.service';
import { EstatusPago } from 'src/model/estatus-pago';
import { EstatusSolicitud } from 'src/model/estatus-solicitud';
import { Solicitud } from 'src/model/solicitud';
import { SolicitudList } from 'src/model/solicitud-list';
import { Usuario } from 'src/model/usuario';
import { Filtros } from 'src/model/filtros';
import { PaginationManager } from 'src/util/pagination';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {

  cargando: boolean = false;

  mostrandoResultadosFiltrados = false;
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
  isInterviewerScales: boolean = false;
  isGhostwriting: boolean = false;

  arrFilterTypes: any[] = ["All", "File", "Customer", "Phone", "Email", "File Status", "Payment Status", "Responsible User", "Waiver"];
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
  filterType: string = "All";
  filterMyFiles: boolean = true;
  filterClosed: boolean = true;
  filterInputText: string = "";
  filterInputDate1: string = "";
  filterInputDate2: string = "";

  filterStartDate: string;
  filterEndDate: string;
  filterSortBy: string = '';
  filterOrder: string = '';

  filtros: string = '';

  arrFilterSortBy: string[] = [];
  arrFilterOrder: string[] = ['ASC','DESC'];

  filtrosObj: Filtros = new Filtros;

  constructor(
    private router: Router,
    private solicitudesService: SolicitudesService,
    private estatusSolicitudService: EstatusSolicitudService,
    private estatusPagoService: EstatusPagoService,
    public utilService: UtilService,
    private route: ActivatedRoute
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

    var today = new Date().toISOString();
    this.filterEndDate = today.split('T', 1)[0];
    this.filterClosed = false;

    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(1);
    this.filterStartDate = ((date.toISOString()).split('T', 1))[0];

    this.obtenerEstatusSolicitudes();
    this.obtenerEstatusPagos();
    //this.clearInputs();
    this.obtenerTextosOrdenarPor();
   
   
  }

  ngOnInit(): void {


    var today = new Date().toISOString();
    var date = new Date();
    date.setMonth(date.getMonth() - 1);
    date.setDate(1);

     //localStorage.setItem('filtros','');
     console.log('f:' + localStorage.getItem('filtros'));
     console.log('b:' + localStorage.getItem('backSolicitud'));
 
     if (localStorage.getItem('backSolicitud') != null) {
 
       if (localStorage.getItem('filtros') != null) {
 
         if (localStorage.getItem('filtros') !== '') {
 
           this.filtrosObj = JSON.parse(localStorage.getItem('filtros'));
           this.filterStartDate = this.filtrosObj.fechainicio;
           this.filterEndDate = this.filtrosObj.fechafin;
           this.filterSortBy = this.filtrosObj.sort;
           this.filterOrder = this.filtrosObj.order;
           this.filterType = this.filtrosObj.campo;
           this.filterInputText = this.filtrosObj.valor;
           this.filterMyFiles = this.filtrosObj.myfiles;
           this.filterClosed = this.filtrosObj.closed;
 
         }
       }
 
       if (localStorage.getItem('backSolicitud') === '1') {
         localStorage.setItem('backSolicitud', '');
         this.filterType = 'All';
       } else {
         this.limpiarFiltros();
         localStorage.setItem('filtros', '');
         this.filterEndDate = today.split('T', 1)[0];
         this.filterStartDate = ((date.toISOString()).split('T', 1))[0];
         this.filterClosed = false;
         this.filterType = 'All';
       }
     } else {
       localStorage.setItem('backSolicitud', '');
       this.filterEndDate = today.split('T', 1)[0];
       this.filterStartDate = ((date.toISOString()).split('T', 1))[0];
       this.filterClosed = false;
       this.filterType = 'All';
 
 
     }

    this.refrescar();
    //console.log('list:'+this.route.snapshot.paramMap.get('valor'));

    
    
  }

  obtenerEstatusSolicitudes() {
    this.cargando = true;
    this.estatusSolicitudService
      .obtenerEstatusSolicitudes()
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

  obtenerTextosOrdenarPor() {
    this.cargando = true;
    this.solicitudesService
      .obtenerTextosOrdenarPor(this.usuario.idUsuario)
      .then(textos => {
        this.arrFilterSortBy = textos;
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
    this.solicitudesService
      .obtenerSolicitudesUsuario(this.filterStartDate, this.filterEndDate, this.filterSortBy, this.filterOrder, this.usuario.idUsuario,this.filterType, this.filterInputText, this.filterMyFiles, this.filterClosed)
      .then(solicitudes => {
        this.solicitudesSinFiltrar = solicitudes;
        this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
        this.paginacion.setArray(this.solicitudes,10);
        
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
        this.paginacion.setArray(this.solicitudes,10);
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
    this.solicitudesService
      //.obtenerReporteSolicitudesFilters(this.usuario.idUsuario, this.filterType, this.filterInputText, this.filterInputDate1, this.filterInputDate2, this.filterMyFiles)
      .obtenerSolicitudesUsuario(this.filterStartDate, this.filterEndDate, this.filterSortBy, this.filterOrder, this.usuario.idUsuario,this.filterType, this.filterInputText, this.filterMyFiles, this.filterClosed)
      .then(solicitudes => {
        this.solicitudesSinFiltrar = solicitudes;
        this.solicitudes = this.solicitudesSinFiltrar.filter(e => true);
        this.paginacion.setArray(this.solicitudes,10);
        this.setearFiltros();
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  setearFiltros(){
    //this.filtros = this.filterStartDate +","+ this.filterEndDate +","+  this.filterSortBy+","+  this.filterOrder+","+  this.usuario.idUsuario+","+ this.filterType+","+  this.filterInputText+","+  this.filterMyFiles;
    this.filtros = "{ \"fechainicio\": \""+this.filterStartDate+"\", \"fechafin\": \""+this.filterEndDate+"\" , \"sort\": \""+this.filterSortBy+"\" , \"order\": \""+this.filterOrder+"\" , \"campo\": \""+this.filterType+"\" , \"valor\": \""+this.filterInputText+"\" , \"myfiles\": \""+this.filterMyFiles+"\", \"closed\": \""+this.filterClosed
    +"\"}";     
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

  limpiarFiltros() {
      this.filterInputText = "";
      this.filterInputDate1 = "";
      this.filterInputDate2 = "";
      this.filterType = "";
      this.filterSortBy = "";
      this.filterOrder = "";
    
  }
  limpiarFiltrosSinFecha() {
    this.filterInputText = "";
    this.filterInputDate1 = "";
    this.filterInputDate2 = "";
    this.filterType = "";
    this.filterSortBy = "";
    this.filterOrder = "";
  
}
  limpiarFechas() {
    this.filterStartDate = "";
    this.filterEndDate = "";  
}

  crearSolicitud() { this.router.navigateByUrl('/solicitudes/solicitudes/nueva-solicitud'); }
}
