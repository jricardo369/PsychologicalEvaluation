import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.config';
import { MovimientoSolicitud } from 'src/model/movimiento-solicitud';
import { ReporteMovimientos } from 'src/model/reporte-movimientos';

@Injectable({
    providedIn: 'root'
})
export class MovimientoSolicitudService {

    constructor(private http: HttpClient) { }

    obtenerMovimientosSolicitud(idSolicitud: number): Promise<MovimientoSolicitud[]> {
        return new Promise<MovimientoSolicitud[]>((resolve, reject) =>
            this.http
                .get(API_URL + "movimientos/" + idSolicitud, {
                    withCredentials: true,
                    observe: "response",
                    headers: new HttpHeaders()
                        .append("Content-Type", "application/json")
                        .append("Authorization", localStorage.getItem("auth_token")),
                })
                .toPromise()
                .then((response) => {
                    resolve(response.body as MovimientoSolicitud[]);
                })
                .catch((reason) => reject(reason))
        );
    }

    crearMovimientoSolicitud(movimientoSolicitud: MovimientoSolicitud, idUsuario: number): Promise<any> {
        let params = new HttpParams();
        params = params.set("envioNotificacion", false.toString());
        params = params.set("idUsuario", idUsuario.toString());
        return new Promise<any>((resolve, reject) =>
            this.http
                .post(API_URL + "movimientos", movimientoSolicitud, {
                    params: params,
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

    obtenerReporteMovimientos(cliente: string, fechaInicio: string, fechaFin: string): Promise<ReporteMovimientos> {
      return new Promise<ReporteMovimientos>((resolve, reject) =>
        this.http
          .get(API_URL + "movimientos/reporte?cliente=" + cliente + "&fechai=" + fechaInicio + "&fechaf=" + fechaFin, {
            withCredentials: true,
            observe: "response",
            headers: new HttpHeaders()
              .append("Content-Type", "application/json")
              .append("Authorization", localStorage.getItem("auth_token")),
          })
          .toPromise()
          .then((response) => {
            resolve(response.body as ReporteMovimientos);
          })
          .catch((reason) => reject(reason))
      );
    }
}
