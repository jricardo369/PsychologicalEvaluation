import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';
import { Usuario } from 'src/model/usuario';
import { DialogoCitaSolicitudComponent } from '../dialogo-cita-solicitud/dialogo-cita-solicitud.component';

export class Semana {
  lunes: CitaSolicitud[];
  martes: CitaSolicitud[];
  miercoles: CitaSolicitud[];
  jueves: CitaSolicitud[];
  viernes: CitaSolicitud[];
  sabado: CitaSolicitud[];
  domingo: CitaSolicitud[];
}

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.scss']
})
export class CitasComponent implements OnInit {

  usuario: Usuario = new Usuario();
  cargando: boolean = false;
  mostrarDatosDia: boolean = false;
  conCitas: boolean = false;
  citasGeneral: CitaSolicitud[] = [];
  citasGeneralR: CitaSolicitud[] = [];
  citasDeDia: CitaSolicitud[] = [];
  citasPorDia: string = "Day Schedules";

  // fecha0: string = "";
  fecha: string = "";
  citas: Semana = new Semana();
  // citasLunes: Cita[] = [];
  // citasMartes: Cita[] = [];
  // citasMiercoles: Cita[] = [];
  // citasJueves: Cita[] = [];
  // citasViernes: Cita[] = [];
  // citasSabado: Cita[] = [];
  // citasDomingo: Cita[] = [];

  constructor(
    private citaSolicitudService: CitaSolicitudService,
    private router: Router,
    public utilService: UtilService,
    private dialog: MatDialog) {
    let hoy: Date = new Date(Date.now());
    this.fecha = this.dateAsYYYYMMDD(hoy);

    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));

    this.refrescar();
  }

  ngOnInit(): void {
  }

  refrescar() {
    this.cargando = true;
    this.citaSolicitudService
      .obtenerCitasPorSemana(this.fecha, this.usuario.idUsuario)
      .then(citas => {
        // this.citas = citas;
        this.citasGeneral = citas;
        this.citasGeneralR = citas;
        this.organizarCitasDeSemana(
          this.obtenerPrimerDiaDeSemana(new Date(this.fecha)),
          citas
        );
        console.log(this.citas);
        if (this.citasPorDia === "Week Schedules") {
          this.citasPorElDia();
        }
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  organizarCitasDeSemana(inicio: Date, citas: CitaSolicitud[]) {
    while (inicio.getDay() <= 6) {

      let fecha = this.dateAsYYYYMMDD(inicio);
      console.log(inicio)

      switch (inicio.getDay()) {
        case 0:
          this.citas.domingo = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          break;
        case 1:
          this.citas.lunes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          break;
        case 2:
          this.citas.martes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          break;
        case 3:
          this.citas.miercoles = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          break;
        case 4:
          this.citas.jueves = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          break;
        case 5:
          this.citas.viernes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          break;
        case 6:
          this.citas.sabado = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          break;
        default:
          break;
      }

      if (inicio.getDay() == 6) break;
      inicio.setDate(inicio.getDate() + 1);
    }
  }

  obtenerPrimerDiaDeSemana(fecha: Date): Date {
    while (fecha.getDay() !== 0) {
      fecha.setDate(fecha.getDate() - 1);
    }
    return fecha;
  }

  dateAsYYYYMMDD(date: Date): string {
    return '' + date.getFullYear() + '-' + this.withLeadingZeros((date.getMonth() + 1), 2) + '-' + this.withLeadingZeros((date.getDate()), 2);
  }

  withLeadingZeros(integer: number, digits: number): string {
    let n = '' + Number.parseInt('' + integer);
    for (let i = n.length; i < digits; i++) n = '0' + n;
    return n;
  }

  crearCita() {
    this.dialog.open(DialogoCitaSolicitudComponent, {
      data: {
        idSolicitud: null,
        creando: true,
        verSolicitud: true
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'creado') this.refrescar();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  verCita(cita: CitaSolicitud) {
    this.dialog.open(DialogoCitaSolicitudComponent, {
      data: {
        idSolicitud: cita.idSolicitud,
        creando: false,
        verSolicitud: true,
        citaSolicitud: cita
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      // if (valor == 'creado') this.refrescar();
    }).catch(reason => this.utilService.manejarError(reason));
  }

  citasDia() {
    if (this.citasPorDia === "Day Schedules") {
      this.citasPorElDia();
    } else {
      this.mostrarDatosDia = false;
      this.citasPorDia = "Day Schedules"
      document.getElementById("citasPorDia").setAttribute("class", "citas-por-dia");
    }

  }

  citasPorElDia() {
    this.citasGeneral = this.citasGeneralR;
    this.mostrarDatosDia = true;
    console.log('citas:' + this.citasGeneral.length);
    this.citasGeneral = this.citasGeneral.filter(cita => cita.fecha.split(' ')[0] == this.fecha) as CitaSolicitud[];
    this.citasDeDia = this.citasGeneral;
    this.citasPorDia = "Week Schedules"
    document.getElementById("citasPorDia").setAttribute("class", "citas-por-semana");
    if (this.citasGeneral.length != 0) {
      this.conCitas = true;
    } else {
      this.conCitas = false;
    }
  }

}
