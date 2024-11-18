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

  fecha: string = "";
  citas: Semana = new Semana();

  constructor(
    private citaSolicitudService: CitaSolicitudService,
    private router: Router,
    public utilService: UtilService,
    private dialog: MatDialog) {
    let hoy: Date = new Date(Date.now());
    this.fecha = this.utilService.dateAsYYYYMMDD(hoy);

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
        // console.log(this.citas);
        if (this.citasPorDia === "Week Schedules") {
          this.citasPorElDia();
        }
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  organizarCitasDeSemana(inicio: Date, citas: CitaSolicitud[]) {
    while (inicio.getDay() <= 6) {

      let fecha = this.utilService.dateAsYYYYMMDD(inicio);
      // console.log(inicio)

      switch (inicio.getDay()) {
        case 0:
          this.citas.domingo = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.domingo = this.ordenarPorHora(this.citas.domingo);
          break;
        case 1:
          this.citas.lunes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.lunes = this.ordenarPorHora(this.citas.lunes);
          break;
        case 2:
          this.citas.martes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.martes = this.ordenarPorHora(this.citas.martes);
          break;
        case 3:
          this.citas.miercoles = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.miercoles = this.ordenarPorHora(this.citas.miercoles);
          break;
        case 4:
          this.citas.jueves = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.jueves = this.ordenarPorHora(this.citas.jueves);
          break;
        case 5:
          this.citas.viernes = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.viernes = this.ordenarPorHora(this.citas.viernes);
          break;
        case 6:
          this.citas.sabado = citas.filter(cita => cita.fecha.split(' ')[0] == fecha) as CitaSolicitud[];
          this.citas.sabado = this.ordenarPorHora(this.citas.sabado);
          break;
        default:
          break;
      }

      if (inicio.getDay() == 6) break;
      inicio.setDate(inicio.getDate() + 1);
    }
  }

  ordenarPorHora(citasDia: CitaSolicitud[]) : CitaSolicitud[] {
    return citasDia.sort((a, b) => (this.horaFormato24(a.hora, a.tipo) > this.horaFormato24(b.hora, b.tipo) ? 1 : -1));
  }

  horaFormato24(hora: string, tipo: string) : string {
    let horas: string = hora.split(':')[0];
    horas = this.utilService.withLeadingZeros((parseInt(horas) + (tipo == 'PM' && horas != '12' ? 12 : 0) - (tipo == 'AM' && horas == '12' ? 12 : 0)), 2);
    let minutos: string = hora.split(':')[1];
    // console.log(horas + ':' + minutos + tipo);
    return horas + ':' + minutos;
  }

  obtenerPrimerDiaDeSemana(fecha: Date): Date {
    while (fecha.getDay() !== 0) {
      fecha.setDate(fecha.getDate() - 1);
    }
    return fecha;
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
    }
  }

  citasPorElDia() {
    this.citasGeneral = this.citasGeneralR;
    this.mostrarDatosDia = true;
    // console.log('citas:' + this.citasGeneral.length);
    this.citasGeneral = this.citasGeneral.filter(cita => cita.fecha.split(' ')[0] == this.fecha) as CitaSolicitud[];
    this.citasDeDia = this.citasGeneral;
    this.citasPorDia = "Week Schedules"
    if (this.citasGeneral.length != 0) {
      this.conCitas = true;
    } else {
      this.conCitas = false;
    }
  }

}
