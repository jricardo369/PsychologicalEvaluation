import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { API_URL } from "../app.config";
import { Solicitud } from "src/model/solicitud";
import { SolicitudList } from "src/model/solicitud-list";

@Injectable({
  providedIn: "root",
})
export class SolicitudesService {
  constructor(private http: HttpClient) { }

  obtenerSolicitud(idSolicitud: number, idUsuario: number): Promise<Solicitud> {
    return new Promise<Solicitud>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/solicitud-por-id/" + idSolicitud + "?idUsuario=" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as Solicitud);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerSolicitudesUsuario(idUsuario: number): Promise<SolicitudList[]> {
    return new Promise<SolicitudList[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/solicitudes-de-usuario/" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudList[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerSolicitudesUsuarioCerradas(idUsuario: number): Promise<SolicitudList[]> {
    return new Promise<SolicitudList[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/solicitudes-de-usuario/" + idUsuario + "?estatus=" + 11, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudList[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerReporteSolicitudesFilters(idUsuario: number, valor: string): Promise<SolicitudList[]> {
    return new Promise<SolicitudList[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/reporte-solicitudes-filters?idUsuario=" + idUsuario + "&valor=" + valor, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudList[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  // Response vacio
  insertarSolicitud(idUsuario: number, solicitud: Solicitud, comentarios: string): Promise<any> {
    let nuevaSolicitud = {
      fechaInicio: solicitud.fechaInicio,
      cliente: solicitud.cliente,
      telefono: solicitud.telefono,
      email: solicitud.email,
      docusign: null,
      abogado: solicitud.abogado,
      email_abogado: solicitud.email_abogado,
      idTipoSolicitud: solicitud.idTipoSolicitud,
      firmaAbogados: solicitud.firmaAbogados,
      comentario: comentarios,
      fechaNacimiento: solicitud.fechaNacimiento,
      adicional: solicitud.adicional,
      apellidos: solicitud.apellidos
    }

    let params = new HttpParams();
    params = params.set("idUsuario", idUsuario.toString());
    return new Promise<any>((resolve, reject) =>
      this.http
        .post(API_URL + "solicitudes", nuevaSolicitud, {
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

  actualizarSolicitud(solicitud: Solicitud): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes", solicitud, {
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

  envioSiguienteProceso(idSolicitud: number, idUsuarioCambio: number, idDisponibilidad?: number): Promise<any> {
    console.log(idDisponibilidad)
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-siguiente-proceso/" + idSolicitud + "?idUsuarioCambio=" + idUsuarioCambio + (idDisponibilidad ? "&idDisponibilidad=" + idDisponibilidad : ""), {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

  envioInterviewerScales(idSolicitud: number, idUsuarioCambio: number, idDisponibilidad: number): Promise<any> {
    console.log(idDisponibilidad)
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-interviewer-scales/" + idSolicitud + "?idUsuarioCambio=" + idUsuarioCambio + "&idDisponibilidad=" + idDisponibilidad, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

  actualizarEstatusSolicitud(idSolicitud: number, idEstatus: number, idUsuario: number, closed?: boolean): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/actualizar-estatus-solicitud/" + idSolicitud + "/" + idEstatus + "?idUsuario=" + idUsuario + (closed ? ("&closed=" + closed) : ""), {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

  reasignarSolicitud(idSolicitud: number, idUsuarioEnvio: number, idUsuarioSeleccionado: number, motivo: string, esRechazo: boolean = false): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/reasignar/" + idSolicitud + "/" + idUsuarioSeleccionado + "?idUsuarioEnvio=" + idUsuarioEnvio + (esRechazo ? "&motivo=" + motivo : ""), {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

}
