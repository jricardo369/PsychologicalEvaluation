import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { AbogadosService } from 'src/app/services/abogados.service';
import { Filter, UtilService } from 'src/app/services/util.service';
import { Abogado } from 'src/model/abogado';
import { PaginationManager } from 'src/util/pagination';
import { DialogoAbogadoComponent } from './../dialogo-abogado/dialogo-abogado.component';

@Component({
  selector: 'app-abogados',
  templateUrl: './abogados.component.html',
  styleUrls: ['./abogados.component.css']
})
export class AbogadosComponent implements OnInit {

  cargando: boolean = false;
  
      mostrandoResultadosFiltrados = false;
      filters: Filter[] = [];
      abogados: Abogado[] = [];
      abogadosSinFiltrar: Abogado[] = [];
      seleccion: number[] = [];
  
      paginacion: PaginationManager = new PaginationManager();
  
      constructor(
      private router: Router,
      private abogadosService: AbogadosService,
      public utilService: UtilService,
          private dialog: MatDialog
      ) {
          let user = JSON.parse(localStorage.getItem('objUsuario'));
      this.refrescar();
    }
  
      ngOnInit(): void {
      }
  
      refrescar() {
          this.cargando = true;
          this.abogadosService
              .obtenerAbogados()
              .then(abogados => {
                  this.abogadosSinFiltrar = abogados;
                  this.abogados = this.abogadosSinFiltrar.filter(e => true);
                  this.paginacion.setArray(this.abogados,15);
              })
              .catch(reason => this.utilService.manejarError(reason))
              .then(() => this.cargando = false)
      }
  
    estanTodosSeleccionados() {
          return this.seleccion.length == this.abogados.length;
      }
  
      checkAll(event: Event, id: string) {
          if (this.estanTodosSeleccionados()) this.seleccion = [];
          else {
              this.seleccion = [];
              this.abogados.forEach(u => this.seleccion.push(u.idAbogado));
          }
      }
  
      estaSeleccionado(id: number) {
          return this.seleccion.find(e => e == id) != null;
      }
  
      check(event: Event, id: number) {
          if ((event.srcElement as HTMLInputElement).checked) {
              //add
              if (!this.estaSeleccionado(id)) this.seleccion.push(id);
          } else {
              //remove
              if (this.estaSeleccionado(id)) this.seleccion.splice(this.seleccion.indexOf(id), 1);
          }
      }
  
      agregarFiltro() {
          this.filters.push(new Filter());
      }
  
      eliminarFiltro(f: Filter) {
          let start = this.filters.indexOf(f);
          let deleteCount = 1;
          this.filters.splice(start, deleteCount);
          if (this.filters.length == 0)
              this.aplicarFiltros();
      }
  
      limpiarFiltros() {
          this.filters = [];
          this.aplicarFiltros();
      }
  
      aplicarFiltros() {
          let filtered = [];
          u: for (let i = 0; i < this.abogadosSinFiltrar.length; i++) {
              let r = this.abogadosSinFiltrar[i];
              for (let j = 0; j < this.filters.length; j++) {
                  let f = this.filters[j];
  
                  let v = null;
  
                  switch (f.campo) {
                      case 'firma': v = r.firma; break;
                      case 'nombre': v = r.nombre; break;
                      case 'email': v = r.email; break;
                      case 'telefono': v = r.telefono; break;
                      case 'sinonimos': v = r.sinonimos; break;
                  }
  
                  switch (f.operador) {
                      case "!=": if (!(v != f.valor)) continue u; break;
                      case "==": if (!(v == f.valor)) continue u; break;
                      case ">=": if (!(v >= f.valor)) continue u; break;
                      case "<=": if (!(v <= f.valor)) continue u; break;
                      case ">": if (!(v > f.valor)) continue u; break;
                      case "<": if (!(v < f.valor)) continue u; break;
                      case "startsWith": if (!(('' + v).toLowerCase().startsWith(('' + f.valor).toLowerCase()))) continue u; break;
                      case "endsWith": if (!(('' + v).toLowerCase().endsWith(('' + f.valor).toLowerCase()))) continue u; break;
                      case "includes": if (!(('' + v).toLowerCase().includes(('' + f.valor).toLowerCase()))) continue u; break;
                  }
  
              }
              filtered.push(r);
          };
          this.abogados = filtered;
          this.abogados.sort((a, b) => b.idAbogado - a.idAbogado);
          this.paginacion.setArray(this.abogados,15);
      }
  
      eliminar() {
          this.dialog.open(DialogoSimpleComponent, {
              data: {
                  titulo: this.seleccion.length > 1 ? 'Delete ' + this.seleccion.length + ' users' : "Delete user",
                  texto: this.seleccion.length > 1 ? 'Do you really want to delete these ' + this.seleccion.length + ' users? Requests related to them will be deleted.' : 'Do you really want to delete the user? Requests related to him will be deleted.',
                  botones: [
                      { texto: 'Cancel', color: '', valor: '' },
                      { texto: this.seleccion.length > 1 ? 'Delete users' : 'Delete user', color: 'primary', valor: 'eliminar' },
                  ]
              },
              disableClose: true,
          }).afterClosed().toPromise().then(valor => {
              if (valor == 'eliminar') {
                  this.cargando = true;
                  let promises = [];
                  this.seleccion.forEach(id => promises.push(this.abogadosService.eliminarAbogado(id)));
                  Promise
                      .all(promises)
                      .then(results => {
                          this.cargando = false;
                          let failed = [];
                          //results.forEach(r => { if (r.success == false) failed.push(r) });
                          if (failed.length > 0) {
                              this.dialog.open(DialogoSimpleComponent, {
                                  data: {
                                      titulo: 'Laywer(s) not deleted',
                                      texto: failed.length == 1 ? 'The user could not be deleted by mass deletion, delete him/her from his/her individual screen.' :
                                          failed.length + ' users could not be deleted by mass deletion, delete them individually.',
                                      botones: [{ texto: 'Ok', color: 'accent' },]
                                  },
                                  disableClose: true,
                              });
                          }
                          this.refrescar();
                      }).catch(e => {
                          //window.alert("ALGO NO SALIO BIEN");
                          this.utilService.manejarError(e);
                          this.cargando = false;
                      });
              }
          }).catch(reason => this.utilService.manejarError(reason));
      }
  
      crearUsuario() {
      this.dialog.open(DialogoAbogadoComponent, {
              data: {},
              disableClose: true,
          }).afterClosed().toPromise().then(valor => {
              if (valor == 'creado') this.refrescar();
          }).catch(reason => this.utilService.manejarError(reason));
    }
  
    editarUsuario(idAbogado: number) {
      this.dialog.open(DialogoAbogadoComponent, {
              data: {
          idAbogado: idAbogado
        },
              disableClose: true,
          }).afterClosed().toPromise().then(valor => {
              if (valor == 'editando') this.refrescar();
          }).catch(reason => this.utilService.manejarError(reason));
    }
  
    descargarExcel() {
    this.cargando = true;
          this.abogadosService.obtenerAbogadosExcel()
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
