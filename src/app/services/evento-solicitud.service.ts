import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { API_URL } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class EventoSolicitudService {

    constructor(private http: HttpClient) { }

    obtenerEventosSolicitud(idSolicitud: number): Promise<EventoSolicitud[]> {
        return new Promise<EventoSolicitud[]>((resolve, reject) =>
            this.http
                .get(API_URL + "eventos-solicitud/" + idSolicitud, {
                    withCredentials: true,
                    observe: "response",
                    headers: new HttpHeaders()
                        .append("Content-Type", "application/json")
                        .append("Authorization", localStorage.getItem("auth_token")),
                })
                .toPromise()
                .then((response) => {
                    resolve(response.body as EventoSolicitud[]);
                })
                .catch((reason) => reject(reason))
        );
    }

    crearEventoSolicitud(eventoSolicitud: EventoSolicitud): Promise<any> {
        return new Promise<any>((resolve, reject) =>
            this.http
                .post(API_URL + "eventos-solicitud", eventoSolicitud, {
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
}
