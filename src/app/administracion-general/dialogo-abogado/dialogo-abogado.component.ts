import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbogadosService } from 'src/app/services/abogados.service';
import { UtilService } from 'src/app/services/util.service';
import { Abogado } from './../../../model/abogado';
import { Permiso } from './../../../model/permiso';
import { Rol } from './../../../model/rol';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';

@Component({
  selector: 'app-dialogo-abogado',
  templateUrl: './dialogo-abogado.component.html',
  styleUrls: ['./dialogo-abogado.component.css']
})
export class DialogoAbogadoComponent implements OnInit {

   cargando: boolean = false;
    creando: boolean = false;
    titulo: string = 'Lawyer';
    abogado: Abogado = new Abogado();
    roles: Rol[] = [];
  
    public file: File[] = [];
  
    isAdministrator: boolean = false;
    isMaster: boolean = false;
    isVendor: boolean = false;
    isBackOffice: boolean = false;
    isInterviewer: boolean = false;
    isVOC: boolean = false;
    isTemplateCreator: boolean = false;
    isInterviewerScales: boolean = false;
    isGhostwriting: boolean = false;
    isTherapist: boolean = false;
  
    constructor(
  
      private abogadosService: AbogadosService,
      public utilService: UtilService,
      private dialog: MatDialog,
      public dialogRef: MatDialogRef<DialogoAbogadoComponent>,
      
      @Inject(MAT_DIALOG_DATA) public data: any) {
  
      if (data.idAbogado) {
        this.titulo = "Edit Lawyer"
        this.abogado.idAbogado = data.idAbogado;
        this.refrescar();
        this.creando = false;
      } else {
        this.titulo = "New Lawyer";
        this.creando = true;
      }
  
     
    }
  
    ngOnInit(): void {
    }
  
   
  
    rolSelected() {
      //this.usuario.rol = this.usuario.rol == "5" ? this.usuario.rol : null;
    }
  
    refrescar() {
      this.cargando = true;
      this.abogadosService
        .obtenerUsuarioPorId(this.abogado.idAbogado)
        .then(abogado => {
          this.abogado = abogado;
        })
        .catch(reason => this.utilService.manejarError(reason))
        .then(() => this.cargando = false);
    }
  
    crear() {
      this.cargando = true;
      this.abogadosService
        .insertarAbogado(this.abogado)
        .then(abogado => {
          this.cerrar('creado');
        })
        .catch(reason => this.utilService.manejarError(reason))
        .then(() => this.cargando = false);
    }
  
    editar() {
      this.cargando = true;
      this.abogadosService
        .editarAbogado(this.abogado)
        .then(abogado => {
          this.cerrar('editando');
        })
        .catch(reason => this.utilService.manejarError(reason))
        .then(() => this.cargando = false);
    }
  
    eliminar() {
      this.dialog.open(DialogoSimpleComponent, {
        data: {
          titulo: 'Delete lawyer',
          texto: 'Do you really want to delete the user? This action is not reversible.',
          botones: [
            { texto: 'Cancel', color: '', valor: '' },
            { texto: 'Delete lawyer', color: 'primary', valor: 'eliminar' },
          ]
        },
        disableClose: true,
      }).afterClosed().toPromise().then(valor => {
        if (valor == 'eliminar') {
          this.cargando = true;
          this.abogadosService
            .eliminarAbogado(this.abogado.idAbogado)
            .then(abogado => {
              this.cerrar('editando');
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
        }
      }).catch(reason => this.utilService.manejarError(reason));
    }
  
    cerrar(accion: string = "") { this.dialogRef.close(accion); }
  
    onFileSelected(files: FileList) {
      // this.file[0] = files.length && files.item(0).type.startsWith('image/') ? files.item(0) : null;
      for (let i = 0; i < files.length; i++) {
        this.file.push(files.item(i));
      }
    }
  
    quitarAdjunto(archivo: File) {
      let start = this.file.findIndex(f => f == archivo);
      this.file.splice(start, 1);
    }

}
