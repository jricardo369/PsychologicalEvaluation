export class Solicitud {
  /*idSolicitud: number;
  fechaInicio: Date;
  cliente: string;
  telefono: string;
  email: string;
  docusign: string;
  amount: number;
  abogado: string;
  email_abogado: string;
  firmaAbogados: string;
  numeroDeCaso: string;
  tipoSolicitud: TipoSolicitud;
  estatusSolicitud: EstatusSolicitud;
  estatusPago: EstatusPago;
  usuarioRevisor: number;
  usuarioRevisando: number;*/
  idSolicitud: number;
  fechaInicio: Date;
  fechaNacimiento: Date;
  adicional: string;
  cliente: string;
  telefono: string;
  email: string;
  docusign: string;
  amount: number;
  abogado: string;
  email_abogado: string;
  numeroDeCaso: string;
  idTipoSolicitud: number;
  idEstatusSolicitud: number;
  idEstatusPago: number;
  firmaAbogados: string;
  tipoSolicitud: string;
  estatusSolicitud: string;
  estatusPago: string;
  age: number;
  fecha_schedule: Date;
  idUsuarioRevisor: number;
  importante: string;
  usuarioRevisor: string;
  usuarioRevisando: string;
  idUsuarioRevisando: number;

  idioma: string;
  tipoEntrevista: string;
  direccion: string;
  estado: string;
  referencia: string;

  apellidos: string;

  usuarioRevisandoNombre: string;
  asignacionTemplate: boolean;

  waiver: boolean;
  paralegalName: string;
  paralegalEmails: string;
  paralegalTelefonos: string;

  asignacionIntSc: boolean;
  usuarioIntScNombre: string;

  fecha_schedule_scales: Date;

  external: boolean;
  usuarioExternal: number;

  dueDate: Date;
}
