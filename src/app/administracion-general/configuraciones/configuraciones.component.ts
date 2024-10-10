import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionService } from 'src/app/services/configuracion.service';
import { UtilService } from 'src/app/services/util.service';
import { Configuracion } from 'src/model/configuracion';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  styleUrls: ['./configuraciones.component.css']
})
export class ConfiguracionesComponent {
  //config = new Configuracion();
  arrConfiguraciones: Array<Configuracion> = [];
  //objconfiguracion = new Configuracion;
  configuracion = new Configuracion;

  cargando: boolean = false;

  //Se creo una variable por cada configuracion
  cambiandoDiasPermitidosParaPagar: boolean = false;
  diasPermitidosParaPagar: number = 0;
  diasPermitidosParaPagarOld: number = 0;

  cambiandoTokenCode: boolean = false;
  tokenCode: string = "";
  tokenCodeOld: string = "";

  cambiandoClientSecret: boolean = false;
  clientSecret: string = "";
  clientSecretOld: string = "";

  cambiandoClientId: boolean = false;
  clientId: string = "";
  clientIdOld: string = "";

  cambiandoTokenId: boolean = false;
  tokenId: string = "";
  tokenIdOld: string = "";

  cambiandoPhoneGoTo: boolean = false;
  phoneGoTo: string = "";
  phoneGoToOld: string = "";

  cambiandoPhoneTest: boolean = false;
  phoneTest: string = "";
  phoneTestOld: string = "";

  cambiandoAdminEmail: boolean = false;
  adminEmail: string = "";
  adminEmailOld: string = "";

  constructor(
    private router: Router,
    private configuracionService: ConfiguracionService,
    public utilService: UtilService) {
    localStorage.setItem('manual_name', 'Manual de Administrador');
    localStorage.setItem('manual_file', 'ManualAdministradorSLAPI');

    this.obtenerConfiguraciones();
  }

  obtenerConfiguraciones() {
    this.cargando = true;
    this.configuracionService
      .getConfiguraciones()
      .subscribe(result => {
        this.arrConfiguraciones = result;
        this.procesarConfiguraciones();
      },
        error => {
          this.utilService.manejarError(error);
        });
  }

  procesarConfiguraciones() {
    for (let index = 0; index < this.arrConfiguraciones.length; index++) {
      switch (Number(this.arrConfiguraciones[index].idConfiguracion)) {
        case 1:
          this.diasPermitidosParaPagar = Number(this.arrConfiguraciones[index].valor);
          this.diasPermitidosParaPagarOld = this.diasPermitidosParaPagar;
          break;
        case 2:
          this.tokenCode = this.arrConfiguraciones[index].valor;
          this.tokenCodeOld = this.tokenCode;
          break;
        case 3:
          this.clientSecret = this.arrConfiguraciones[index].valor;
          this.clientSecretOld = this.clientSecret;
          break;
        case 4:
          this.clientId = this.arrConfiguraciones[index].valor;
          this.clientIdOld = this.clientId;
          break;
        case 5:
          this.tokenId = this.arrConfiguraciones[index].valor;
          this.tokenIdOld = this.tokenId;
          break;
        case 6:
          this.phoneGoTo = this.arrConfiguraciones[index].valor;
          this.phoneGoTo = this.onPhoneNumberInput(this.phoneGoTo);
          this.phoneGoToOld = this.phoneGoTo;
          break;
        case 7:
          this.phoneTest = this.arrConfiguraciones[index].valor;
          this.phoneTest = this.onPhoneNumberInput(this.phoneTest);
          this.phoneTestOld = this.phoneTest;
          break;
        case 8:
          this.adminEmail = this.arrConfiguraciones[index].valor;
          this.adminEmailOld = this.adminEmail;
          break;
        default:
          break;
      }
    }
    this.cargando = false;
  }

  cambiarDato(caso: number) {
    this.configuracion.idConfiguracion = caso;
    this.configuracion.codigo = this.arrConfiguraciones[caso - 1].codigo;
    this.configuracion.descripcion = this.arrConfiguraciones[caso - 1].descripcion;
    switch (caso) {
      case 1:
        this.configuracion.valor = this.diasPermitidosParaPagar.toString();
        break;
      case 2:
        this.configuracion.valor = this.tokenCode.toString();
        break;
      case 3:
        this.configuracion.valor = this.clientSecret.toString();
        break;
      case 4:
        this.configuracion.valor = this.clientId.toString();
        break;
      case 5:
        this.configuracion.valor = this.tokenId.toString();
        break;
      case 6:
        this.configuracion.valor = this.phoneGoTo.toString();
        break;
      case 7:
        this.configuracion.valor = this.phoneTest.toString();
        break;
      case 8:
        this.configuracion.valor = this.adminEmail.toString();
        break;
      default:
        break;
    }

    this.cargando = true;
    this.configuracionService
      .asignarVariable(this.configuracion)
      .then(response => {
        this.utilService.mostrarDialogoSimple("Change made successfully", "");
        if (response.status === 200) {
          switch (caso) {
            case 1:
              this.diasPermitidosParaPagarOld = this.diasPermitidosParaPagar;
              this.cambiandoDiasPermitidosParaPagar = false;
              break;
            case 2:
              this.tokenCodeOld = this.tokenCode;
              this.cambiandoTokenCode = false;
              break;
            case 3:
              this.clientSecretOld = this.clientSecret;
              this.cambiandoClientSecret = false;
              break;
            case 4:
              this.clientIdOld = this.clientId;
              this.cambiandoClientId = false;
              break;
            case 5:
              this.tokenIdOld = this.tokenId;
              this.cambiandoTokenId = false;
              break;
            case 6:
              this.phoneGoToOld = this.phoneGoTo;
              this.cambiandoPhoneGoTo = false;
              break;
            case 7:
              this.phoneTestOld = this.phoneTest;
              this.cambiandoPhoneTest = false;
              break;
            case 8:
              this.adminEmailOld = this.adminEmail;
              this.cambiandoAdminEmail = false;
              break;
            default:
              break;
          }
          this.obtenerConfiguraciones();
          this.cargando = false;
        }
      }).catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  cancelarCambio(caso: number) {
    switch (caso) {
      case 1:
        this.cambiandoDiasPermitidosParaPagar = false;
        this.diasPermitidosParaPagar = this.diasPermitidosParaPagarOld;
        break;
      case 2:
        this.cambiandoTokenCode = false;
        this.tokenCode = this.tokenCodeOld;
        break;
      case 3:
        this.cambiandoClientSecret = false;
        this.clientSecret = this.clientSecretOld;
        break;
      case 4:
        this.cambiandoClientId = false;
        this.clientId = this.clientIdOld;
        break;
      case 5:
        this.cambiandoTokenId = false;
        this.tokenId = this.tokenIdOld;
        break;
      case 6:
        this.cambiandoPhoneGoTo = false;
        this.phoneGoTo = this.phoneGoToOld;
        break;
      case 7:
        this.cambiandoPhoneTest = false;
        this.phoneTest = this.phoneTestOld;
        break;
      case 8:
        this.cambiandoAdminEmail = false;
        this.adminEmail = this.adminEmailOld;
        break;
      default:
        break;
    }
  }

  onPhoneNumberInput(inputText: string): string {
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
    return trimmedValue;
  }
}
