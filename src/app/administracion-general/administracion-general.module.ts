import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AdministracionGeneralRoutingModule } from './administracion-general-routing.module';
import { GeneralNavComponent } from './general-nav/general-nav.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { DentalUiModule } from '../dental-ui/dental-ui.module';
import { MatDialogModule } from '@angular/material/dialog';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { DialogoUsuarioComponent } from './dialogo-usuario/dialogo-usuario.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { TareasProgramadasComponent } from './tareas-programadas/tareas-programadas.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        AdministracionGeneralRoutingModule,
        MatIconModule,
        MatProgressSpinnerModule,
        FormsModule,
        DentalUiModule,
        MatDialogModule,
    ],
    entryComponents: [
        DialogoUsuarioComponent,
    ],
    declarations: [
        GeneralNavComponent,
        UsuariosComponent,
        DialogoUsuarioComponent,
        ConfiguracionesComponent,
        TareasProgramadasComponent,
    ],
    providers: [
    ]
})
export class AdministracionGeneralModule { }
