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
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { ADMINISTRATOR, BACKOFFICE, INTERVIEWER, MASTER, TEMPLATE_CREATOR, VENDOR, VOC } from 'src/app/app.config';
import { EventosSolicitudComponent } from '../eventos-solicitud/eventos-solicitud.component';
import { AdjuntosComponent } from '../adjuntos/adjuntos.component';
import { MovimientosSolicitudComponent } from '../movimientos-solicitud/movimientos-solicitud.component';

@Component({
  selector: "app-solicitud",
  templateUrl: "./solicitud.component.html",
  styleUrls: ["./solicitud.component.css"],
})
export class SolicitudComponent implements OnInit {
  cargando: boolean = false;
  usuario: Usuario = new Usuario();
  titulo: string = "";

  solicitud: Solicitud = new Solicitud;
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

  @ViewChild(EventosSolicitudComponent, { static: false }) eventosSolicitudComponent: EventosSolicitudComponent;
  @ViewChild(AdjuntosComponent, { static: false }) adjuntosComponent: AdjuntosComponent;
  // @ViewChild(MovimientosSolicitudComponent, { static: false }) movimientosSolicitudComponent: MovimientosSolicitudComponent;

  constructor(
    route: ActivatedRoute,
    public utilService: UtilService,
    private solicitudesService: SolicitudesService,
    private tiposSolicitudService: TiposSolicitudService,
    private tiposPagoService: TiposPagoService,
    private scalesService: ScalesService,
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

    route.params.subscribe((params) => {
      let codigo = params["id"];
      if (codigo.toString() == "nueva-solicitud") {
        this.titulo = "New File";
        this.creando = true;
        this.obtenerTiposSolicitud();
      } else {
        this.editando = true;
        this.obtenerSolicitud(Number.parseInt(codigo));
      }
    });
  }

  ngOnInit(): void { console.log("MOVIMIENTOS: " + this.isBackOffice); }

  obtenerSolicitud(idSolicitud: number) {
    this.cargando = true;
    Promise.all([
      this.tiposSolicitudService.obtenerTiposSolicitud(),
      this.tiposPagoService.obtenerTiposPago(),
      this.solicitudesService.obtenerSolicitud(idSolicitud),
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
        this.goBack();
      })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  guardarCambios() {
    this.solicitud.idTipoSolicitud = this.inputTipoSolicitud.idTipoSolicitud;
    this.solicitud.tipoSolicitud = this.inputTipoSolicitud.nombre;
    this.cargando = true;
    this.solicitudesService.actualizarSolicitud(this.solicitud).then((solicitud) => {
      this.obtenerSolicitud(this.solicitud.idSolicitud);
    })
      .catch((reason) => this.utilService.manejarError(reason))
      .then(() => (this.cargando = false));
  }

  goBack() {
    this.utilService.goBack();
  }

  siguienteProceso() {
    if (this.solicitud.idEstatusSolicitud == 1) {
      this.dialog.open(DialogoSiguienteProcesoComponent, {
        data: {
          idSolicitud: this.solicitud.idSolicitud,
          idUsuario: this.usuario.idUsuario
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'enviado') this.goBack();
      }).catch(reason => this.utilService.manejarError(reason));
    } else {
      this.dialog.open(DialogoSimpleComponent, {
        data: {
          titulo: 'Send to next process',
          texto: 'Do you really want to send to next process?',
          botones: [
            { texto: 'Cancel', color: '', valor: '' },
            { texto: 'Send', color: 'primary', valor: 'enviar' },
          ]
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'enviar') {
          this.cargando = true;
          this.solicitudesService.envioSiguienteProceso(this.solicitud.idSolicitud, this.usuario.idUsuario)
            .then(() => {
              this.cargando = false;
              this.goBack();
            }).catch(e => {
              //window.alert("ALGO NO SALIO BIEN");
              this.utilService.manejarError(e);
              this.cargando = false;
            });
        }
      }).catch(reason => this.utilService.manejarError(reason));
    }

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

  cambiarEstatusSolicitud(idEstatusSolicitud: number, closed?: boolean) {
    switch (idEstatusSolicitud) {
      case 4: //Reject Request
        this.dialog.open(DialogoSimpleComponent, {
          data: {
            titulo: 'Reject File',
            texto: 'Do you really want to reject the File?',
            botones: [
              { texto: 'Cancel', color: '', valor: '' },
              { texto: 'Reject', color: 'primary', valor: 'ok' },
            ]
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'ok') {
            this.cargando = true;
            this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario)
              .then(() => {
                this.cargando = false;
                this.goBack();
              }).catch(e => {
                this.utilService.manejarError(e);
                this.cargando = false;
              });
          }
        }).catch(reason => this.utilService.manejarError(reason));
        break;
      case 5: //No-show
        this.dialog.open(DialogoSimpleComponent, {
          data: {
            titulo: 'No-show',
            texto: 'Do you really want to do this action?',
            botones: [
              { texto: 'Cancel', color: '', valor: '' },
              { texto: 'OK', color: 'primary', valor: 'ok' },
            ]
          },
          disableClose: true,
        }).afterClosed().toPromise().then(valor => {
          if (valor == 'ok') {
            this.cargando = true;
            this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario)
              .then(() => {
                this.cargando = false;
                this.goBack();
              }).catch(e => {
                this.utilService.manejarError(e);
                this.cargando = false;
              });
          }
        }).catch(reason => this.utilService.manejarError(reason));
        break;
      case 11: //Finish-Case
        if (closed) {
          this.cargando = true;
          this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario, closed)
            .then(() => {
              this.cargando = false;
              this.goBack();
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
                { texto: 'OK', color: 'primary', valor: 'ok' },
              ]
            },
            disableClose: true,
          }).afterClosed().toPromise().then(valor => {
            if (valor == 'ok') {
              this.cargando = true;
              this.solicitudesService.actualizarEstatusSolicitud(this.solicitud.idSolicitud, idEstatusSolicitud, this.usuario.idUsuario)
                .then(() => {
                  this.cargando = false;
                  this.goBack();
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
            if (idEstatusSolicitud == 8 || idEstatusSolicitud == 7) {
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
}
