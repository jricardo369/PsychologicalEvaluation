import { ScalesService } from './../../services/scales.service';
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { TiposPagoService } from "src/app/services/tipos-pago.service";
import { TiposSolicitudService } from "src/app/services/tipos-solicitud.service";
import { UtilService } from "src/app/services/util.service";
import { TipoPago } from "src/model/tipo-pago";
import { TipoSolicitud } from "src/model/tipo-solicitud";
import { Usuario } from "src/model/usuario";
import { DialogoSiguienteProcesoComponent } from "../dialogo-siguiente-proceso/dialogo-siguiente-proceso.component";
import { DialogoNotificacionesComponent } from "../dialogo-notificaciones/dialogo-notificaciones.component";
import { Scale } from 'src/model/scale';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { ADMINISTRATOR, BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, THERAPIST, VENDOR, VOC } from 'src/app/app.config';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DialogoSolicitudCasenumberComponent } from '../dialogo-solicitud-casenumber/dialogo-solicitud-casenumber.component';
import { DialogoSolicitudTelefonoComponent } from '../dialogo-solicitud-telefono/dialogo-solicitud-telefono.component';
import { ReportesService } from '../../services/reportes.service';
import { SolicitudVoc } from 'src/model/solicitud-voc';
import { SolicitudesVocService } from 'src/app/services/solicitudes-voc.service';
import { AdjuntosVocComponent } from '../adjuntos-voc/adjuntos-voc.component';
import { EventosSolicitudVocComponent } from '../eventos-solicitud-voc/eventos-solicitud-voc.component';
import { DialogoAsignarTerapeutaComponent } from '../dialogo-asignar-terapeuta/dialogo-asignar-terapeuta.component';
import { CitasSolicitudComponent } from '../citas-solicitud/citas-solicitud.component';

@Component({
  selector: "app-solicitud-voc",
  templateUrl: "./solicitud-voc.component.html",
  styleUrls: ["./solicitud-voc.component.css"],
})
export class SolicitudVocComponent implements OnInit {
  cargando: boolean = false;
  usuario: Usuario = new Usuario();
  titulo: string = "";

  solicitud: SolicitudVoc = new SolicitudVoc;
  comentarios: string = "";

  public arrTipoSolicitud: TipoSolicitud[] = [];
  public inputTipoSolicitud: TipoSolicitud = new TipoSolicitud;

  arrTipoPago: TipoPago[] = [];
  inputTipoPago: TipoPago = new TipoPago;

  arrScales: Scale[] = [];
  inputScale: Scale = new Scale;

  scales: string[] = ['Scale 1', 'Scale 2', 'Scale 3', 'Scale 4', 'Scale 5'];

  creando: boolean = false;
  editando: boolean = false;

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

  arrStates: any[] = [];
  arrLanguages: any = [];
  arrTypesOfInterview: any = [];
  arrReferralSources: any = [];
  arrUsuariosExternal: Usuario[] = [];

  @ViewChild(EventosSolicitudVocComponent, { static: false }) eventosSolicitudVocComponent: EventosSolicitudVocComponent;
  @ViewChild(AdjuntosVocComponent, { static: false }) adjuntosVocComponent: AdjuntosVocComponent;
  // @ViewChild(MovimientosSolicitudComponent, { static: false }) movimientosSolicitudComponent: MovimientosSolicitudComponent;
  @ViewChild(CitasSolicitudComponent, { static: false }) citasSolicitudComponent: CitasSolicitudComponent;

  constructor(
    route: ActivatedRoute,
    public utilService: UtilService,
    private solicitudesVocService: SolicitudesVocService,
    private tiposSolicitudService: TiposSolicitudService,
    private tiposPagoService: TiposPagoService,
    private scalesService: ScalesService,
    private usuariosService: UsuariosService,
    private reportesService: ReportesService,
    private dialog: MatDialog
  ) {
    this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
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

    route.params.subscribe((params) => {
      let codigo = params["id"];
      if (codigo.toString() == "nueva-solicitud") {
        this.titulo = "New File";
        this.creando = true;
        // this.solicitud.asignacionTemplate = false;
        // this.solicitud.waiver = false;
        this.solicitud.paralegalName = null;
        this.solicitud.paralegalEmails = null;
        this.solicitud.paralegalTelefonos = null;
        this.obtenerTiposSolicitud();
        // this.solicitud.external = false;
        this.solicitud.fechaInicio = new Date();
        this.solicitud.numSesiones = 0;
        this.solicitud.numSchedules = 0;
        this.solicitud.sesionesPendientes = 0;
        this.solicitud.documento1 = false;
        this.solicitud.documento2 = false;
      } else {
        this.editando = true;
        this.obtenerSolicitud(Number.parseInt(codigo));
      }
    });

    this.arrStates = [
      {
        name: "Alabama",
        abbreviation: "AL"
      },
      {
        name: "Alaska",
        abbreviation: "AK"
      },
      {
        name: "American Samoa",
        abbreviation: "AS"
      },
      {
        name: "Arizona",
        abbreviation: "AZ"
      },
      {
        name: "Arkansas",
        abbreviation: "AR"
      },
      {
        name: "California",
        abbreviation: "CA"
      },
      {
        name: "Colorado",
        abbreviation: "CO"
      },
      {
        name: "Connecticut",
        abbreviation: "CT"
      },
      {
        name: "Delaware",
        abbreviation: "DE"
      },
      {
        name: "District Of Columbia",
        abbreviation: "DC"
      },
      {
        name: "Federated States Of Micronesia",
        abbreviation: "FM"
      },
      {
        name: "Florida",
        abbreviation: "FL"
      },
      {
        name: "Georgia",
        abbreviation: "GA"
      },
      {
        name: "Guam",
        abbreviation: "GU"
      },
      {
        name: "Hawaii",
        abbreviation: "HI"
      },
      {
        name: "Idaho",
        abbreviation: "ID"
      },
      {
        name: "Illinois",
        abbreviation: "IL"
      },
      {
        name: "Indiana",
        abbreviation: "IN"
      },
      {
        name: "Iowa",
        abbreviation: "IA"
      },
      {
        name: "Kansas",
        abbreviation: "KS"
      },
      {
        name: "Kentucky",
        abbreviation: "KY"
      },
      {
        name: "Louisiana",
        abbreviation: "LA"
      },
      {
        name: "Maine",
        abbreviation: "ME"
      },
      {
        name: "Marshall Islands",
        abbreviation: "MH"
      },
      {
        name: "Maryland",
        abbreviation: "MD"
      },
      {
        name: "Massachusetts",
        abbreviation: "MA"
      },
      {
        name: "Michigan",
        abbreviation: "MI"
      },
      {
        name: "Minnesota",
        abbreviation: "MN"
      },
      {
        name: "Mississippi",
        abbreviation: "MS"
      },
      {
        name: "Missouri",
        abbreviation: "MO"
      },
      {
        name: "Montana",
        abbreviation: "MT"
      },
      {
        name: "Nebraska",
        abbreviation: "NE"
      },
      {
        name: "Nevada",
        abbreviation: "NV"
      },
      {
        name: "New Hampshire",
        abbreviation: "NH"
      },
      {
        name: "New Jersey",
        abbreviation: "NJ"
      },
      {
        name: "New Mexico",
        abbreviation: "NM"
      },
      {
        name: "New York",
        abbreviation: "NY"
      },
      {
        name: "North Carolina",
        abbreviation: "NC"
      },
      {
        name: "North Dakota",
        abbreviation: "ND"
      },
      {
        name: "Northern Mariana Islands",
        abbreviation: "MP"
      },
      {
        name: "Ohio",
        abbreviation: "OH"
      },
      {
        name: "Oklahoma",
        abbreviation: "OK"
      },
      {
        name: "Oregon",
        abbreviation: "OR"
      },
      {
        name: "Palau",
        abbreviation: "PW"
      },
      {
        name: "Pennsylvania",
        abbreviation: "PA"
      },
      {
        name: "Puerto Rico",
        abbreviation: "PR"
      },
      {
        name: "Rhode Island",
        abbreviation: "RI"
      },
      {
        name: "South Carolina",
        abbreviation: "SC"
      },
      {
        name: "South Dakota",
        abbreviation: "SD"
      },
      {
        name: "Tennessee",
        abbreviation: "TN"
      },
      {
        name: "Texas",
        abbreviation: "TX"
      },
      {
        name: "Utah",
        abbreviation: "UT"
      },
      {
        name: "Vermont",
        abbreviation: "VT"
      },
      {
        name: "Virgin Islands",
        abbreviation: "VI"
      },
      {
        name: "Virginia",
        abbreviation: "VA"
      },
      {
        name: "Washington",
        abbreviation: "WA"
      },
      {
        name: "West Virginia",
        abbreviation: "WV"
      },
      {
        name: "Wisconsin",
        abbreviation: "WI"
      },
      {
        name: "Wyoming",
        abbreviation: "WY"
      }
    ];

    this.arrLanguages = [
      {
        name: "English"
      },
      {
        name: "Spanish"
      }
    ];

    this.arrTypesOfInterview = [
      {
        name: "Phone Call"
      },
      {
        name: "Zoom Video Call"
      },
      {
        name: "In Person"
      }
    ];

    this.arrReferralSources = [
      {
        name: "Google"
      },
      {
        name: "Facebook"
      },
      {
        name: "Direct referral from other client"
      },
      {
        name: "Lawyer"
      }
    ];
  }

  ngOnInit(): void { console.log("MOVIMIENTOS: " + this.isBackOffice);localStorage.setItem('backSolicitudVOC', '1'); }

  validateCS(){
    if (this.solicitud.numeroDeCaso === null || typeof this.solicitud.numeroDeCaso === 'undefined' || this.solicitud.numeroDeCaso.length === 0) {
      this.utilService.mostrarDialogoSimple("Warning", "The case number field is empty.");
    } else {
      this.dialog.open(DialogoSolicitudCasenumberComponent, {
        data: {
          numeroCaso: this.solicitud.numeroDeCaso
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'vacio') this.utilService.mostrarDialogoSimple("Warning", "No files were found with this phone.");
      }).catch(reason => this.utilService.manejarError(reason));
    }
  }

  obtenerSolicitud(idSolicitud: number) {
    this.cargando = true;
    Promise.all([
      this.tiposSolicitudService.obtenerTiposSolicitud(),
      this.tiposPagoService.obtenerTiposPago(),
      this.solicitudesVocService.obtenerSolicitud(idSolicitud, this.usuario.idUsuario),
      this.scalesService.obtenerScalesSolicitud(idSolicitud)
    ])
      .then((results) => {
        this.arrTipoSolicitud = results[0];
        this.arrTipoPago = results[1];
        this.solicitud = results[2];
        this.arrScales = results[3];
        this.arrScales.sort((a, b) => b.idScale - a.idScale);
        this.inputTipoSolicitud = this.arrTipoSolicitud[this.arrTipoSolicitud.findIndex(tipo => tipo.idTipoSolicitud == this.solicitud.idTipoSolicitud)];
        //this.inputTipoPago = this.arrTipoPago[this.arrTipoPago.findIndex(tipo => tipo.idTipoPago == this.solicitud.id)];
        this.onPhoneNumberInput(this.solicitud.telefono);
        this.titulo = "File " + this.solicitud.idSolicitud;
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  obtenerTiposSolicitud() {
    this.cargando = true;
    this.tiposSolicitudService
      .obtenerTiposSolicitud()
      .then((tiposSolicitud) => {
        this.arrTipoSolicitud = tiposSolicitud;
        this.inputTipoSolicitud = this.arrTipoSolicitud[0];
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  obtenerTiposPago() {
    this.cargando = true;
    this.tiposPagoService
      .obtenerTiposPago()
      .then((tiposPago) => {
        this.arrTipoPago = tiposPago;
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  crearSolicitud() {
    this.solicitud.idTipoSolicitud = this.inputTipoSolicitud.idTipoSolicitud;
    this.solicitud.tipoSolicitud = this.inputTipoSolicitud.nombre;
    console.log(this.solicitud)
    this.cargando = true;
    this.solicitudesVocService
      .insertarSolicitud(
        this.usuario.idUsuario,
        this.solicitud
      )
      .then((solicitud) => {
        /*window.history.replaceState({}, '',
                        '/solicitudes/solicitudes/' + solicitud.idSolicitud);
                    this.creando = false;
                    this.obtenerSolicitud(solicitud.idSolicitud);*/
        this.goBack();
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  guardarCambios() {
    this.solicitud.idTipoSolicitud = this.inputTipoSolicitud.idTipoSolicitud;
    this.solicitud.tipoSolicitud = this.inputTipoSolicitud.nombre;
    this.cargando = true;
    this.solicitudesVocService.actualizarSolicitud(this.solicitud).then((solicitud) => {
      this.obtenerSolicitud(this.solicitud.idSolicitud);
    })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  goBack() {
    this.utilService.goBack();
  }

  envioInterviewerScales() {
    this.dialog.open(DialogoSiguienteProcesoComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        idUsuario: this.usuario.idUsuario,
        interviewerScales: true
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') this.goBack();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  enviarNotificaciones() {
    this.dialog.open(DialogoNotificacionesComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        usuario: this.usuario
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') this.refreshEventosSolicitud();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  asignarTerapeuta() {
    this.dialog.open(DialogoAsignarTerapeutaComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        idUsuario: this.usuario.idUsuario,
        terapeuta: this.solicitud.terapeuta
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'asignado') this.obtenerSolicitud(this.solicitud.idSolicitud);
      this.eventosSolicitudVocComponent.refresh();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  cambiarEstatusSolicitud(idEstatusSolicitud: number, closed?: boolean) {
    this.cargando = true;
    this.solicitudesVocService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario, closed)
      .then(() => {
        this.obtenerSolicitud(this.solicitud.idSolicitud);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  refreshEventosSolicitud() {
    this.eventosSolicitudVocComponent.refresh();
  }

  viewDoc(url: string) {
    console.log(url)
    window.open(url, '_blank');
  }

  addScale() {
    this.cargando = true;
    this.scalesService.insertarScale(this.solicitud.idSolicitud, this.inputScale, this.usuario.idUsuario)
      .then(() => {
        this.scalesService.obtenerScalesSolicitud(this.solicitud.idSolicitud)
          .then(response => {
            this.arrScales = response;
            this.arrScales.sort((a, b) => b.idScale - a.idScale);
          })
          .catch((reason) => this.utilService.manejarError(reason))
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  removeScale(idScale: number) {
    this.cargando = true;
    this.scalesService.eliminarScale(idScale)
      .then(() => {
        this.scalesService.obtenerScalesSolicitud(this.solicitud.idSolicitud)
          .then(response => {
            this.arrScales = response;
            this.arrScales.sort((a, b) => b.idScale - a.idScale);
          })
          .catch((reason) => this.utilService.manejarError(reason))
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  onPhoneNumberInput(inputText: string): void {
    let trimmedValue = inputText.replace(/\D/g, ''); // Eliminar caracteres que no sean dígitos

    if (trimmedValue.length > 10) {
      trimmedValue = trimmedValue.slice(0, 10); // Limitar a 10 dígitos (formato de teléfono sin código de país)
    }

    // Aplicar la máscara (###) ###-####
    if (trimmedValue.length > 6) {
      trimmedValue = `(${trimmedValue.slice(0, 3)}) ${trimmedValue.slice(3, 6)}-${trimmedValue.slice(6)}`;
    } else if (trimmedValue.length > 3) {
      trimmedValue = `(${trimmedValue.slice(0, 3)}) ${trimmedValue.slice(3)}`;
    }
    this.solicitud.telefono = trimmedValue;
  }

  // usuarioExternalChange() {
  //   this.solicitud.external = !this.solicitud.external;

  //   if (this.solicitud.external) {
  //     this.cargando = true;
  //     this.usuariosService.obtenerUsuariosPorRol(9).then(usuariosExternal => {
  //       this.cargando = false;
  //       this.arrUsuariosExternal = usuariosExternal;
  //     }).catch(e => {
  //       this.utilService.manejarError(e);
  //       this.cargando = false;
  //     });
  //   }
  // }

  validatePhone() {
    if (this.solicitud.telefono === null || typeof this.solicitud.telefono === 'undefined' || this.solicitud.telefono.length === 0) {
      this.utilService.mostrarDialogoSimple("Warning", "The Phone field is empty.");
    } else {
      this.dialog.open(DialogoSolicitudTelefonoComponent, {
        data: {
          telefono: this.solicitud.telefono
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'vacio') this.utilService.mostrarDialogoSimple("Warning", "No files were found with this phone.");
      }).catch(reason => this.utilService.manejarError(reason));
    }
  }

  validateEmptyField(field: any): boolean {
    return field === null || typeof field === 'undefined' || field.length === 0;
  }

  generateProcessLetter() {
    this.cargando = true;
    this.solicitudesVocService.generateProcessLetter(this.solicitud.idSolicitud, this.usuario.idUsuario).then(response => {
      this.utilService.saveByteArray("progress-letter_file-" + this.solicitud.idSolicitud, response, 'pdf');
    }).catch(e => this.utilService.manejarError(e))
      .finally(() => this.cargando = false);
  }

  completeFile() {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Complete File',
        texto: 'Do you really want to complete this file?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.solicitudesVocService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, 11, this.usuario.idUsuario, false)
          .then(() => {
            this.obtenerSolicitud(this.solicitud.idSolicitud);
          })
          .catch((reason) => this.utilService.manejarError(reason))
          .then(() => (this.cargando = false));
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  reopenFile() {
    this.cargando = true;
    this.solicitudesVocService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, 14, this.usuario.idUsuario, false)
      .then(() => {
        this.obtenerSolicitud(this.solicitud.idSolicitud);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  document1CheckChange() {
    this.solicitud.documento1 = !this.solicitud.documento1;

    if (!this.solicitud.documento1) {
      this.solicitud.fechaDoc1 = null;
    }
  }

  document2CheckChange() {
    this.solicitud.documento2 = !this.solicitud.documento2;

    if (!this.solicitud.documento2) {
      this.solicitud.fechaDoc2 = null;
    }
  }
}
