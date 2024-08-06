import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { API_URL } from "../app.config";
import { DisponibilidadUsuario } from "src/model/disponibilidad-usuario";

@Injectable({
	providedIn: "root",
})
export class DisponibilidadUsuariosService {
	constructor(private http: HttpClient) { }

	obtenerDisponibilidadUsuariosPorDia(fecha: string): Promise<DisponibilidadUsuario[]> {
		return new Promise<DisponibilidadUsuario[]>((resolve, reject) =>
			this.http
				.get(API_URL + "disponibilidad-usuarios/de-dia/" + fecha, {
					withCredentials: true,
					observe: "response",
					headers: new HttpHeaders()
						.append("Content-Type", "application/json")
						.append("Authorization", localStorage.getItem("auth_token")),
				})
				.toPromise()
				.then((response) => {
					resolve(response.body as DisponibilidadUsuario[]);
				})
				.catch((reason) => reject(reason))
		);
	}

	obtenerDisponibilidadUsuario(idUsuario: number): Promise<DisponibilidadUsuario[]> {
		return new Promise<DisponibilidadUsuario[]>((resolve, reject) =>
			this.http
				.get(API_URL + "disponibilidad-usuarios/" + idUsuario, {
					withCredentials: true,
					observe: "response",
					headers: new HttpHeaders()
						.append("Content-Type", "application/json")
						.append("Authorization", localStorage.getItem("auth_token")),
				})
				.toPromise()
				.then((response) => {
					resolve(response.body as DisponibilidadUsuario[]);
				})
				.catch((reason) => reject(reason))
		);
	}

	agregarDisponibilidadUsuario(disponibilidadUsuario: DisponibilidadUsuario): Promise<any> {
		return new Promise<any>((resolve, reject) =>
			this.http
				.post(API_URL + "disponibilidad-usuarios", disponibilidadUsuario, {
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

  eliminarDisponibilidadUsuario(idDisponibilidad: number) {
    return new Promise((resolve, reject) => this.http
        .delete(API_URL + 'disponibilidad-usuarios/' + idDisponibilidad,
            {
                withCredentials: true,
                observe: 'response',
                headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
            })
        .toPromise()
        .then(response => {
            resolve(response.body);
        })
        .catch(reason => reject(reason))
    );
}

}