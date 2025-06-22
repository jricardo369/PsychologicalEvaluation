import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { CitaSolicitudService } from 'src/app/services/cita-solicitud.service';
import { UtilService } from 'src/app/services/util.service';
import { CargoVoc } from 'src/model/cargo-voc';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';

@Component({
  selector: 'app-cargos-voc',
  templateUrl: './cargos-voc.component.html',
  styleUrls: ['./cargos-voc.component.css']
})
export class CargosVocComponent implements OnInit {

  cargando: boolean = false;
  arrCargos: CargoVoc[] = [];
  usuario: Usuario = new Usuario;
  paginacion: PaginationManager = new PaginationManager();

 
  filterInputDate1: string = "";
  filterInputDate2: string = "";
  arrFilterType: string[] = ['All','Unpaid','Paid'];
  arrFilterTypeF: string[] = ['All','Case number','Customer','Phone','Email'];
  filterType: string = "";
  filterTypeF: string = "";
  filterInputText: string = "";

  constructor(
    private citaSolicitudService: CitaSolicitudService,
    private dialog: MatDialog,
    public utilService: UtilService
  ) {

    var date = new Date();

    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
    let hoy: Date = new Date(Date.now());
    //let primerDiadelMes: Date = new Date(Date.now());
    let primerDiadelMes: Date =  new Date();
    primerDiadelMes.setMonth(date.getMonth() - 8);
    primerDiadelMes.setDate(1);

    this.filterInputDate1 = this.utilService.dateAsYYYYMMDD(primerDiadelMes);
    this.filterInputDate2 = this.utilService.dateAsYYYYMMDD(hoy);
    this.filterType = 'Unpaid';
    this.filterTypeF = 'All';
  }

  ngOnInit(): void {
    this.refrescar();
  }

  refrescar() {
    this.cargando = true;
    this.citaSolicitudService
      .obtenerCargosPendientes(this.filterInputDate1, this.filterInputDate2, this.filterInputText, this.usuario.idUsuario,this.filterTypeF,this.filterInputText,this.filterType)
      .then(cargos => {
        this.arrCargos = cargos;
        this.paginacion.setArray(this.arrCargos,20);
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false)
  }

  limpiarFechas() {
    this.filterInputDate1 = "";
    this.filterInputDate2 = "";  
}

  pagado(cargo: CargoVoc) {
    this.dialog.open(DialogoSimpleComponent, {
      data: {
        titulo: 'Paid',
        texto: 'Do you really want to mark this charge as paid?',
        botones: [
          { texto: 'Cancel', color: '', valor: '' },
          { texto: 'Yes', color: 'primary', valor: 'ok' },
        ]
      },
      disableClose: true,
    }).afterClosed().toPromise().then(valor => {
      if (valor == 'ok') {
        this.cargando = true;
        this.citaSolicitudService
          .pagado(cargo.idCita, true, this.usuario.idUsuario)
          .then(() => {
            this.refrescar();
          })
          .catch(reason => this.utilService.manejarError(reason));
          // .then(() => this.cargando = false);
      }
    }).catch(reason => this.utilService.manejarError(reason));
  }

  descargarExcel(){
    this.cargando = true;
    this.citaSolicitudService.obtenerCargosPendientesExcel(this.filterInputDate1, this.filterInputDate2, this.filterInputText, this.usuario.idUsuario,this.filterTypeF,this.filterInputText,this.filterType) 
      .subscribe(
        data =>{
          const file = new Blob([data], {type: 'application/vnd.ms-excel'});
          var fileUrl = URL.createObjectURL(file);
          let link: any = window.document.createElement('a');
          link.href = fileUrl;
          let aux = fileUrl.split('/');
          link.download = aux[aux.length -1]+".xlsx";
          link.click();
          this.cargando = false;
        }
      )
  }


}
