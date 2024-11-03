import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { API_URL } from '../app.config';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { NotaCita } from 'src/model/nota-cita';

@Injectable({
  providedIn: 'root'
})
export class NotaCitaService {

  constructor(private http: HttpClient) { }

  obtenerNotasCita(idCita: number): Promise<NotaCita[]> {
    return new Promise<NotaCita[]>((resolve, reject) =>
      this.http
        .get(API_URL + "notas-citas/" + idCita, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as NotaCita[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  guardarNota(nota: NotaCita): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .post(API_URL + "notas-citas", nota, {
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
