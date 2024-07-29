import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.config';
import { ReporteSolicitudesUsuarios } from 'src/model/reporte-solicitudes-usuarios';
import { ReporteCorreosEnviados } from 'src/model/reporte-correos-enviados';

@Injectable({
	providedIn: 'root'
})
export class ReportesService {

	constructor(private http: HttpClient) { }

	obtenerUsersRequests(fechaInicio: string, fechaFin: string): Promise<ReporteSolicitudesUsuarios[]> {
		return new Promise<ReporteSolicitudesUsuarios[]>((resolve, reject) =>
			this.http
				.get(API_URL + "reportes/solicitudes-de-usuarios?fechai=" + fechaInicio + "&fechaf=" + fechaFin, {
					withCredentials: true,
					observe: "response",
					headers: new HttpHeaders()
						.append("Content-Type", "application/json")
						.append("Authorization", localStorage.getItem("auth_token")),
				})
				.toPromise()
				.then((response) => {
					resolve(response.body as ReporteSolicitudesUsuarios[]);
				})
				.catch((reason) => reject(reason))
		);
	}

  obtenerCorreosEnviados(fechaInicio: string, fechaFin: string): Promise<ReporteCorreosEnviados[]> {
		return new Promise<ReporteCorreosEnviados[]>((resolve, reject) =>
			this.http
				.get(API_URL + "reportes/correos-a-abogados?fechai=" + fechaInicio + "&fechaf=" + fechaFin, {
					withCredentials: true,
					observe: "response",
					headers: new HttpHeaders()
						.append("Content-Type", "application/json")
						.append("Authorization", localStorage.getItem("auth_token")),
				})
				.toPromise()
				.then((response) => {
					resolve(response.body as ReporteCorreosEnviados[]);
				})
				.catch((reason) => reject(reason))
		);
	}


}
