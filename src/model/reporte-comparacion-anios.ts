export class ReporteComparacionAnios {
  anioActual: number;
  anioAnterior: number;
  mesesAnioActual: ReporteComparacionAniosMes[];
  mesesAnioAnterior: ReporteComparacionAniosMes[];
}

export class ReporteComparacionAniosMes {
  mes: string;
  mesNum: number;
  monto: number;
  numSolicitudes: number;
}
