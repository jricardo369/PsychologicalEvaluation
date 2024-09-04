import { Permiso } from "./permiso";

export class Usuario {
    idUsuario: number;
    usuario: string;
    contrasenia: string;
    nombre: string;
    direccion: string;
    telefono: string;
    ciudad: string;
    pais: string;
    correoElectronico: string;
    fechaCreacion: string;
    rol: string;
    intentos: number;
    estatus: string;
    edad: number;
    sexo: string;
    resumen: string;
    permisos: Permiso[];

    ausencia: boolean;
}
