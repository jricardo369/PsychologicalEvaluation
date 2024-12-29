import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { API_URL } from "../app.config";
import { Solicitud } from "src/model/solicitud";
import { SolicitudList } from "src/model/solicitud-list";
import { SolicitudTelefono } from "src/model/solicitud-telefono";
import { ReporteComparacionAnios } from "src/model/reporte-comparacion-anios";

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

  obtenerSolicitudesUsuario(fechai: string, fechaf: string, ordenarPor: string, orden: string, idUsuario: number): Promise<SolicitudList[]> {
    return new Promise<SolicitudList[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/solicitudes-de-usuario/" + idUsuario + "?fechai=" + fechai + "&fechaf=" + fechaf + "&ordenarPor=" + ordenarPor + "&orden=" + orden, {
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

  obtenerSolicitudesDeTelefono(telefono: string): Promise<SolicitudTelefono[]> {
    return new Promise<SolicitudTelefono[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/solicitudes-de-telefono/" + telefono, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as SolicitudTelefono[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerReporteSolicitudesFilters(idUsuario: number, campo: string, valor: string, fecha1: string, fecha2: string, myFiles: boolean): Promise<SolicitudList[]> {
    let queryParams: string = "";
    if (campo == "All" || campo == "File" || campo == "Customer" || campo == "Phone" || campo == "Email" || campo == "File Status" || campo == "Payment Status" || campo == "Responsible User" || campo == "Waiver") {
      queryParams = "idUsuario=" + idUsuario + "&campo=" + campo + "&valor=" + valor + "&myFiles=" + myFiles;
    } else if (campo == "Date") {
      queryParams = "idUsuario=" + idUsuario + "&campo=" + campo + "&fecha1=" + fecha1 + "&fecha2=" + fecha2 + "&myFiles=" + myFiles;
    }
    return new Promise<SolicitudList[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/reporte-solicitudes-filters?" + queryParams, {
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

  obtenerTextosOrdenarPor(idUsuario: number): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/obtener-textos-ordenar-por/" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as string[]);
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
      apellidos: solicitud.apellidos,
      external: solicitud.external,
      usuarioExternal: solicitud.usuarioExternal,
      idioma: solicitud.idioma,
      estado: solicitud.estado
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

  envioSiguienteProceso(idSolicitud: number, fechaAnterior: boolean, idUsuarioCambio: number, idDisponibilidad?: number): Promise<any> {
    console.log(idDisponibilidad)
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-siguiente-proceso/" + idSolicitud + "?idUsuarioCambio=" + idUsuarioCambio + (idDisponibilidad ? "&idDisponibilidad=" + idDisponibilidad : "") + "&fechaAnterior=" + fechaAnterior, {
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

  envioInterviewerScales(idSolicitud: number, fechaAnterior: boolean, idUsuarioCambio: number, idDisponibilidad: number): Promise<any> {
    console.log(idDisponibilidad)
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "solicitudes/envio-interviewer-scales/" + idSolicitud + "?idUsuarioCambio=" + idUsuarioCambio + "&idDisponibilidad=" + idDisponibilidad + "&fechaAnterior=" + fechaAnterior, {
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

  obtenerReporteComparacionAnios(anio: number, fileStatus: string): Promise<ReporteComparacionAnios> {
    return new Promise<ReporteComparacionAnios>((resolve, reject) =>
      this.http
        .get(API_URL + "solicitudes/reporte-anios/" + anio + "?filtro=" + fileStatus, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as ReporteComparacionAnios);
        })
        .catch((reason) => reject(reason))
    );
  }

}
