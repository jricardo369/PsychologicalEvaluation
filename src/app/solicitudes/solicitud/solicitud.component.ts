import { ScalesService } from './../../services/scales.service';
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SolicitudesService } from "src/app/services/solicitudes.service";
import { TiposPagoService } from "src/app/services/tipos-pago.service";
import { TiposSolicitudService } from "src/app/services/tipos-solicitud.service";
import { UtilService } from "src/app/services/util.service";
import { Solicitud } from "src/model/solicitud";
import { TipoPago } from "src/model/tipo-pago";
import { TipoSolicitud } from "src/model/tipo-solicitud";
import { Usuario } from "src/model/usuario";
import { DialogoSiguienteProcesoComponent } from "../dialogo-siguiente-proceso/dialogo-siguiente-proceso.component";
import { DialogoNotificacionesComponent } from "../dialogo-notificaciones/dialogo-notificaciones.component";
import { Scale } from 'src/model/scale';
import { Abogado } from 'src/model/abogado';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { ADMINISTRATOR, BACKOFFICE, CLINICIAN, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, VENDOR, VOC } from 'src/app/app.config';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { AdjuntosComponent } from '../adjuntos/adjuntos.component';
import { MovimientosSolicitudComponent } from '../movimientos-solicitud/movimientos-solicitud.component';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DialogoSolicitudTelefonoComponent } from '../dialogo-solicitud-telefono/dialogo-solicitud-telefono.component';
import { ReportesService } from '../../services/reportes.service';
import { AbogadosService } from '../../services/abogados.service';
import { DialogoCancelarCitaSolicitudComponent } from '../dialogo-cancelar-cita-solicitud/dialogo-cancelar-cita-solicitud.component';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap,startWith } from 'rxjs/operators';


@Component({
  selector: "app-solicitud",
  templateUrl: "./solicitud.component.html",
  styleUrls: ["./solicitud.component.css"],
})
export class SolicitudComponent implements OnInit {

  arrAssignedClinicians: Usuario[] = [];

  cargando: boolean = false;
  usuario: Usuario = new Usuario();
  titulo: string = "";

  solicitud: Solicitud = new Solicitud;
  comentarios: string = "";

  lawyerFirm: string = "";
  lawyerName: string = "";
  lawyerEmail: string = "";
  lawyerPhone: string = "";
  lawyerSyn: string = "";

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
  isClinician: boolean = false;

  arrStates: any[] = [];
  arrLanguages: any = [];
  arrTypesOfInterview: any = [];
  arrReferralSources: any = [];
  arrUsuariosExternal: Usuario[] = [];
  abogadosFiltrados!: Observable<Abogado[]>;

  @ViewChild(EventosSolicitudComponent, { static: false }) eventosSolicitudComponent: EventosSolicitudComponent;
  @ViewChild(AdjuntosComponent, { static: false }) adjuntosComponent: AdjuntosComponent;
  // @ViewChild(MovimientosSolicitudComponent, { static: false }) movimientosSolicitudComponent: MovimientosSolicitudComponent;

  constructor(
    route: ActivatedRoute,
    private router: Router,
    public utilService: UtilService,
    private solicitudesService: SolicitudesService,
    private tiposSolicitudService: TiposSolicitudService,
    private tiposPagoService: TiposPagoService,
    private scalesService: ScalesService,
    private usuariosService: UsuariosService,
    private reportesService: ReportesService,
    private abogadosService: AbogadosService,
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
    this.isClinician = this.usuario.rol == CLINICIAN ? true : false;

    route.params.subscribe((params) => {
      let codigo = params["id"];
      if (codigo.toString() == "nueva-solicitud") {
        this.titulo = "New File";
        this.creando = true;
        this.solicitud.asignacionTemplate = false;
        this.solicitud.waiver = false;
        this.solicitud.paralegalName = null;
        this.solicitud.paralegalEmails = null;
        this.solicitud.paralegalTelefonos = null;
        this.obtenerTiposSolicitud();
        
        this.solicitud.external = false;
      } else {
        this.editando = true;
        this.obtenerSolicitud(Number.parseInt(codigo));
        
      }
     
    });

    this.obtenerUsuariosAssignedClinician();

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

  abogadoControl = new FormControl();
  abogados: Abogado[] = [];
  abogadoSeleccionado?: Abogado;


  ngOnInit(): void { 
    /*this.abogadoControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((valor) =>
          typeof valor === 'string' && valor.length > 1
            ? this.abogadosService.obtenerAbogadosPorNombre(valor)
            : of([])
        )
      )
      .subscribe((res) => (this.abogados = res));*/
    console.log("MOVIMIENTOS: " + this.isBackOffice); localStorage.setItem('backSolicitud', '1'); console.log(this.solicitud);

    
  }

  limpiarAssignedClinician(){
    this.solicitud.assignedClinician = null;
  }

   displayFn(abogado: Abogado): string {
    return abogado ? abogado.nombre : '';
  }

  onOptionSelected(event: any): void {
    this.abogadoSeleccionado = event.option.value;
    console.log('Abogado seleccionado:', this.abogadoSeleccionado);
  }  

  obtenerSolicitud(idSolicitud: number) {
    this.cargando = true;
    Promise.all([
      this.tiposSolicitudService.obtenerTiposSolicitud(),
      this.tiposPagoService.obtenerTiposPago(),
      this.solicitudesService.obtenerSolicitud(idSolicitud, this.usuario.idUsuario),
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

      /*  
      if (this.solicitud.idAbogado > 0) {
          this.abogadosService.obtenerUsuarioPorId(this.solicitud.idAbogado).then(abogado => {

            this.abogadoSeleccionado = abogado;
            this.lawyerName = abogado.nombre;
            this.lawyerFirm =  abogado.firma;
            this.lawyerEmail = abogado.email;
            this.lawyerPhone = abogado.telefono;
            this.lawyerSyn = abogado.sinonimos;
          })
            .catch((reason) => this.utilService.manejarError(reason))
            .then(() => (this.cargando = false));

        }*/

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
    this.solicitudesService
      .insertarSolicitud(
        this.usuario.idUsuario,
        this.solicitud,
        this.comentarios
      )
      .then((solicitud) => {
        /*window.history.replaceState({}, '',
                        '/solicitudes/solicitudes/' + solicitud.idSolicitud);
                    this.creando = false;
                    this.obtenerSolicitud(solicitud.idSolicitud);*/
        //this.goBack();
         this.router.navigate(['/solicitudes/solicitudes']);
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  guardarCambios() {

    /*const valor = this.abogadoControl.value;

    // Si escribió algo pero no seleccionó un objeto válido
    if (typeof valor !== 'object') {
      this.utilService.mostrarDialogoSimple("Error", "You must select the right lawyer"); 
      return;
    }
    
    if(this.abogadoSeleccionado != null){

   
      console.log("idAbogadoseleccionado:"+this.abogadoSeleccionado.idAbogado);
      this.solicitud.idAbogado = this.abogadoSeleccionado.idAbogado;
      
    }*/
    this.solicitud.idTipoSolicitud = this.inputTipoSolicitud.idTipoSolicitud;
    this.solicitud.tipoSolicitud = this.inputTipoSolicitud.nombre;
    this.cargando = true;
    this.solicitudesService.actualizarSolicitud(this.solicitud,false,this.usuario.idUsuario).then((solicitud) => {
      this.obtenerSolicitud(this.solicitud.idSolicitud);
    })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  guardarCambiosClosed() {
    this.solicitud.idTipoSolicitud = this.inputTipoSolicitud.idTipoSolicitud;
    this.solicitud.tipoSolicitud = this.inputTipoSolicitud.nombre;
    this.cargando = true;
    this.solicitudesService.actualizarSolicitud(this.solicitud,true,this.usuario.idUsuario).then((solicitud) => {
      this.obtenerSolicitud(this.solicitud.idSolicitud);
    })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => {this.cargando = false;this.refreshSolicitudCompleta()});
  }

  goBack() {
    this.utilService.goBack();
   
  }

  siguienteProceso() {
    if (this.solicitud.idEstatusSolicitud == 1 && !this.isInterviewerScales) { //Send to Interviewe
      this.dialog.open(DialogoSiguienteProcesoComponent, {
        data: {
          idSolicitud: this.solicitud.idSolicitud,
          idUsuario: this.usuario.idUsuario,
          interviewerScales: false
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'enviado') {
          if (this.isMaster || this.isVendor || this.isBackOffice) {
            this.obtenerSolicitud(this.solicitud.idSolicitud);
            this.refreshSolicitudCompleta();
          }
          else {
            //this.goBack();
             this.router.navigate(['/solicitudes/solicitudes']);
          }
        }
      }).catch(reason => this.utilService.manejarError(reason));
    } else {
      this.cargando = true;
      this.solicitudesService.obtenerSolicitud(this.solicitud.idSolicitud, this.usuario.idUsuario).then(validateSolicitud => {
        this.dialog.open(DialogoSimpleComponent, {
          data: {
            titulo: 'Send to next process',
            texto: 'Do you really want to send to next process?',
            warning: validateSolicitud.idEstatusSolicitud == 10
              && (this.validateEmptyField(validateSolicitud.email_abogado)
                || this.validateEmptyField(validateSolicitud.firmaAbogados)
                || this.validateEmptyField(validateSolicitud.paralegalEmails))
              ? 'The paralegal data is missing, remember that if it is sent to the next process you will not receive notification.' : null,
            botones: [
              { texto: 'Cancel', color: '', valor: '' },
              { texto: 'Send', color: 'primary', valor: 'enviar' },
            ]
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'enviar') {
            this.cargando = true;
            this.solicitudesService.envioSiguienteProceso(this.solicitud.idSolicitud, false, this.usuario.idUsuario)
              .then(() => {
                this.cargando = false;
                //this.goBack();
                 this.router.navigate(['/solicitudes/solicitudes']);
              }).catch(e => {
                //window.alert("ALGO NO SALIO BIEN");
                this.utilService.manejarError(e);
                this.cargando = false;
              });
          }
        }).catch(reason => this.utilService.manejarError(reason));
      }).catch(reason => this.utilService.manejarError(reason))
        .finally(() => this.cargando = false);
    }
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
      if (valor == 'enviado') {
        if (this.isMaster || this.isVendor || this.isBackOffice) {
          this.obtenerSolicitud(this.solicitud.idSolicitud);
          this.refreshSolicitudCompleta();
        }
        else {
          //this.goBack();
           this.router.navigate(['/solicitudes/solicitudes']);
        }
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  envioFinEntrevistaClinician() {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Finish review file',
        texto: 'Do you really want to do this action?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.solicitudesService.envioFinEntrevistaClinician(this.solicitud.idSolicitud, this.usuario.idUsuario)
          .then(() => {
            this.cargando = false;
            //this.goBack();
             this.router.navigate(['/solicitudes/solicitudes']);
          }).catch(e => {
            this.utilService.manejarError(e);
            this.cargando = false;
          });
      }
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

  asignarTemplate() {
    let usuariosOptions: any[] = [];
    this.cargando = true;
    this.usuariosService.obtenerUsuariosPorRol(7).then(usuarios => {
      this.cargando = false;
      usuarios.forEach(usuario => usuariosOptions.push({ display: usuario.nombre, value: usuario.idUsuario }));

      if (usuariosOptions.length > 0) {
        let campos = [];
        campos.push({ label: "User", type: "select", placeholder: "select user", value: usuariosOptions[0].value, options: usuariosOptions });
        this.utilService
          .mostrarDialogoConFormulario(
            "Assign Template",
            "Select user asign",
            "Send",
            "Cancel",
            campos
          ).then(valor => {
            if (valor == 'ok') {
              this.cargando = true;
              this.solicitudesService.reasignarSolicitud(this.solicitud.idSolicitud, this.usuario.idUsuario, campos[0].value, "")
                .then(() => {
                  this.cargando = false;
                  //this.goBack();
                   this.router.navigate(['/solicitudes/solicitudes']);
                }).catch(e => {
                  this.utilService.manejarError(e);
                  this.cargando = false;
                });
            }
          }).catch(reason => this.utilService.manejarError(reason));
      } else {
        this.utilService.mostrarDialogoSimple("Warning", "There are no templates available");
      }
    }).catch(e => {
      this.utilService.manejarError(e);
      this.cargando = false;
    });
  }

  cancelTemplate() {
    let usuariosOptions: any[] = [];
        this.cargando = true;
        this.usuariosService.obtenerUsuariosPorRol(4, 1).then(usuarios => {
          this.cargando = false;
          usuarios.forEach(usuario => usuariosOptions.push({ display: usuario.nombre, value: usuario.idUsuario }));

          if (usuariosOptions.length > 0) {
            let campos = [];
            if (!this.isInterviewerScales) campos.push({ label: "User to asign", type: "select", placeholder: "select user", value: usuariosOptions[0].value, options: usuariosOptions });
            campos.push({ label: "Cancel assign Template", type: "textarea", placeholder: "Enter your rejection reason", value: "", maxLength: 500 });
            this.utilService
              .mostrarDialogoConFormulario(
                "Cancel assign Template",
                "Complete the information",
                "Send",
                "Cancel",
                campos
              ).then(valor => {
                if (valor == 'ok') {
                  if (this.isInterviewerScales) campos.splice(0, 0, { value: 0 });
                  this.cargando = true;
                  this.solicitudesService.cancelTemplate(this.solicitud.idSolicitud, this.usuario.idUsuario, campos[0].value, campos[1].value)
                    .then(() => {
                      this.cargando = false;
                      //this.goBack();
                       this.router.navigate(['/solicitudes/solicitudes']);
                    }).catch(e => {
                      this.utilService.manejarError(e);
                      this.cargando = false;
                    });
                }
              }).catch(reason => this.utilService.manejarError(reason));
          } else {
            this.utilService.mostrarDialogoSimple("Warning", "There are no users available");
          }
        }).catch(e => {
          this.utilService.manejarError(e);
          this.cargando = false;
        });
  }

  cancelarCita() {
    this.dialog.open(DialogoCancelarCitaSolicitudComponent, {
      data: {
        idSolicitud: this.solicitud.idSolicitud,
        idUsuario: this.usuario.idUsuario
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'enviado') {this.obtenerSolicitud(this.solicitud.idSolicitud);this.refreshSolicitudCompleta();}
      else if (valor == 'vacio') {this.utilService.mostrarDialogoSimple("Warning", "Has no appointments yet.");}
    }).catch(reason => this.utilService.manejarError(reason));
  }

  cambiarEstatusSolicitud(idEstatusSolicitud: number, closed?: boolean) {
    switch (idEstatusSolicitud) {
      case 4: //Reject Request
    
        let usuariosOptions: any[] = [];
        this.cargando = true;
        this.usuariosService.obtenerUsuariosPorRol(4, 1).then(usuarios => {
          this.cargando = false;
          usuarios.forEach(usuario => usuariosOptions.push({ display: usuario.nombre, value: usuario.idUsuario }));

          if (usuariosOptions.length > 0) {
            let campos = [];
            if (!this.isInterviewerScales) campos.push({ label: "User to Notify", type: "select", placeholder: "select user", value: usuariosOptions[0].value, options: usuariosOptions });
            campos.push({ label: "Rejection reason", type: "textarea", placeholder: "Enter your rejection reason", value: "", maxLength: 500 });
            this.utilService
              .mostrarDialogoConFormulario(
                "Reject File",
                "Complete the information",
                "Send",
                "Cancel",
                campos
              ).then(valor => {
                if (valor == 'ok') {
                  if (this.isInterviewerScales) campos.splice(0, 0, { value: 0 });
                  this.cargando = true;
                  this.solicitudesService.reasignarSolicitud(this.solicitud.idSolicitud, this.usuario.idUsuario, campos[0].value, campos[1].value, true)
                    .then(() => {
                      this.cargando = false;
                      //this.goBack();
                       this.router.navigate(['/solicitudes/solicitudes']);
                    }).catch(e => {
                      this.utilService.manejarError(e);
                      this.cargando = false;
                    });
                }
              }).catch(reason => this.utilService.manejarError(reason));
          } else {
            this.utilService.mostrarDialogoSimple("Warning", "There are no users available");
          }
        }).catch(e => {
          this.utilService.manejarError(e);
          this.cargando = false;
        });
        break;

      case 5: //No-show
        this.dialog.open(DialogoSimpleComponent, {
          data: {
            titulo: 'No-show',
            texto: 'Do you really want to do this action?',
            botones: [
              { texto: 'Cancel', color: '', valor: '' },
              { texto: 'Yes', color: 'primary', valor: 'ok' },
            ]
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'ok') {
            this.cargando = true;
            this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario)
              .then(() => {
                this.cargando = false;
                //this.goBack();
                 this.router.navigate(['/solicitudes/solicitudes']);
              }).catch(e => {
                this.utilService.manejarError(e);
                this.cargando = false;
              });
          }
        }).catch(reason => this.utilService.manejarError(reason));
        break;
      case 7: //Lost
        this.dialog.open(DialogoSimpleComponent, {
          data: {
            titulo: 'Lost',
            texto: 'Do you really want to mark this file as lost?',
            botones: [
              { texto: 'Cancel', color: '', valor: '' },
              { texto: 'Yes', color: 'primary', valor: 'ok' },
            ]
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'ok') {
            this.cargando = true;
            this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario, closed)
              .then(() => {
                this.eventosSolicitudComponent.refresh();
                this.obtenerSolicitud(this.solicitud.idSolicitud);
              })
              .catch((reason) => this.utilService.manejarError(reason))
              .then(() => (this.cargando = false));
          }
        }).catch(reason => this.utilService.manejarError(reason));
        break;
      case 11: //Finish-Case
        if (closed) {
          this.cargando = true;
          this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario, closed)
            .then(() => {
              this.cargando = false;
              //this.goBack();
               this.router.navigate(['/solicitudes/solicitudes']);
            })
            .catch((reason) => this.utilService.manejarError(reason))
            .then(() => (this.cargando = false));
        } else {
          this.dialog.open(DialogoSimpleComponent, {
            data: {
              titulo: 'Finish Case',
              texto: 'Do you really want to finish the case?',
              botones: [
                { texto: 'Cancel', color: '', valor: '' },
                { texto: 'Yes', color: 'primary', valor: 'ok' },
              ]
            },
            disableClose: true,
          }).afterClosed().toPromise().then(valor => {
            if (valor == 'ok') {
              this.cargando = true;
              this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario)
                .then(() => {
                  this.cargando = false;
                  //this.goBack();
                   this.router.navigate(['/solicitudes/solicitudes']);
                })
                .catch((reason) => this.utilService.manejarError(reason))
                .then(() => (this.cargando = false));
            }
          }).catch(reason => this.utilService.manejarError(reason));
        }
        break;
      default:
        this.cargando = true;
        this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario, closed)
          .then(() => {
            if (idEstatusSolicitud == 8) {
              this.eventosSolicitudComponent.refresh();
            }
            this.obtenerSolicitud(this.solicitud.idSolicitud);
          })
          .catch((reason) => this.utilService.manejarError(reason))
          .then(() => (this.cargando = false));
        break;
    }
  }

  refreshEventosSolicitud() {
    this.eventosSolicitudComponent.refresh();
  }

  viewDoc(url: string) {
    console.log(url)
    window.open(url, '_blank');
  }

  refreshSolicitudCompleta(){
    this.eventosSolicitudComponent.refresh();
    this.obtenerSolicitud(this.solicitud.idSolicitud);
  }

  addScale() {
    this.cargando = true;
    this.scalesService.insertarScale(this.solicitud.idSolicitud, this.inputScale, this.usuario.idUsuario)
      .then(() => {
        this.scalesService.obtenerScalesSolicitud(this.solicitud.idSolicitud)
          .then(response => {
            this.arrScales = response;
            this.arrScales.sort((a, b) => b.idScale - a.idScale);
            this.eventosSolicitudComponent.refresh();
            this.inputScale.scale = '';
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

  usuarioExternalChange() {
    this.solicitud.external = !this.solicitud.external;

    if (this.solicitud.external) {
      this.cargando = true;
      this.usuariosService.obtenerUsuariosPorRol(9).then(usuariosExternal => {
        this.cargando = false;
        this.arrUsuariosExternal = usuariosExternal;
      }).catch(e => {
        this.utilService.manejarError(e);
        this.cargando = false;
      });
    }
  }

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

  generateW9() {
    this.cargando = true;
    this.reportesService.generateW9(this.solicitud.idSolicitud, this.usuario.idUsuario).then(response => {
      this.utilService.saveByteArray("invoice_file-" + this.solicitud.idSolicitud, response, 'pdf');
    }).catch(e => this.utilService.manejarError(e))
      .finally(() => this.cargando = false);
  }

  obtenerUsuariosAssignedClinician() {
    this.cargando = true;
    this.usuariosService.obtenerUsuariosAssignedClinician()
      .then(usuarios => {
        this.arrAssignedClinicians = usuarios;
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }
}
