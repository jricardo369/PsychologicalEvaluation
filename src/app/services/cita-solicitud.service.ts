import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { API_URL } from '../app.config';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { CargoVoc } from 'src/model/cargo-voc';

@Injectable({
  providedIn: 'root'
})
export class CitaSolicitudService {

  constructor(private http: HttpClient) { }

  obtenerCitasSolicitud(idSolicitud: number): Promise<CitaSolicitud[]> {
    return new Promise<CitaSolicitud[]>((resolve, reject) =>
      this.http
        .get(API_URL + "citas/citas-de-solicitud/" + idSolicitud, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as CitaSolicitud[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  crearCitaSolicitud(citaSolicitud: CitaSolicitud, idUsuario: number): Promise<any> {
    let nuevaCitaSolicitud = {
      comentario: citaSolicitud.comentario,
      fecha: citaSolicitud.fecha,
      hora: citaSolicitud.hora,
      tipo: citaSolicitud.tipo,
      dosCitas: citaSolicitud.dosCitas,
      idUsuario: idUsuario,
      idSolicitud: citaSolicitud.idSolicitud
    }
    return new Promise<any>((resolve, reject) =>
      this.http
        .post(API_URL + "citas", nuevaCitaSolicitud, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body);
        })
        .catch((reason) => reject(reason))
    );
  }

  no_show(idCita: number, idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "citas/no-show/" + idCita + "?idUsuario=" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => resolve(response))
        .catch((reason) => reject(reason))
    );
  }

  descargarCita(idCita: number, idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http
        .get(API_URL + "citas/reporte/" + idCita + "?idUsuario=" + idUsuario,
          {
            withCredentials: true,
            observe: 'response',
            responseType: 'arraybuffer',
            headers: new HttpHeaders().append('Content-Type', 'application/octet-stream').append('Authorization', localStorage.getItem('auth_token'))
          })
        .toPromise()
        .then(response => {
          resolve(response.body);
        }).catch(reason => reject(reason));
    });
  }

  obtenerCitasPorSemana(filterFecha: string, filterUsuario: number, filterViewAvalability: boolean, idUsuario: number): Promise<CitaSolicitud[]> {
    return new Promise<CitaSolicitud[]>((resolve, reject) => this.http
      .get(API_URL + 'citas/citas-de-usuario-semana/' + idUsuario + "?fecha=" + filterFecha + "&filtro=" + (filterUsuario > 0 ? filterUsuario : "") + "&disponibilidad=" + filterViewAvalability,
        {
          withCredentials: true,
          observe: 'response',
          headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
        })
      .toPromise()
      .then(response => {
        resolve(response.body as CitaSolicitud[]);
      })
      .catch(reason => reject(reason))
    );
  }

  obtenerCargosPendientes(fechai: string, fechaf: string, filtro: string, idUsuario: number): Promise<CargoVoc[]> {
    return new Promise<CargoVoc[]>((resolve, reject) => this.http
      .get(API_URL + 'citas/cargos-pendientes?idUsuario=' + idUsuario + "&fechai=" + fechai + "&fechaf=" + fechaf + "&filtro=" + filtro,
        {
          withCredentials: true,
          observe: 'response',
          headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
        })
      .toPromise()
      .then(response => {
        resolve(response.body as CargoVoc[]);
      })
      .catch(reason => reject(reason))
    );
  }

  pagado(idCita: number, pagado: boolean, idUsuario: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "citas/pagado/" + idCita + "/" + pagado + "?idUsuario=" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => resolve(response))
        .catch((reason) => reject(reason))
    );
  }
}
