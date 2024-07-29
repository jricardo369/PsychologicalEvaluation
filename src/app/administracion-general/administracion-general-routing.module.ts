import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppBarNavItem } from '../app-nav-item';
import { CustomI18nService } from '../custom-i18n.service';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { TareasProgramadasComponent } from './tareas-programadas/tareas-programadas.component';

const routes: Routes = [
    { path: 'usuarios', component: UsuariosComponent, },
    { path: 'configuraciones', component: ConfiguracionesComponent, },
    { path: 'tareas-programadas', component: TareasProgramadasComponent, },

    { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
];

const MODULE: AppBarNavItem = {
    module: null,
    title: 'General Administration',
    subtitle: null,
    uri: 'administracion-general',
    svgName: 'administracion',
    isVisibleFor: u => u.rol == "1"
};

export const ADMIN_GENERAL_ITEMS: AppBarNavItem[] = [
    {
        module: MODULE,
        svgName: 'users2',
        title: 'Users',
        subtitle: 'Manage the users and their permissions',
        uri: 'usuarios',
        isVisibleFor: u => u.rol == "1"
    },
    {
        module: MODULE,
        svgName: 'settings',
        title: 'Settings',
        subtitle: 'Manage the settings',
        uri: 'configuraciones',
        isVisibleFor: u => u.rol == "1"
    },
    {
        module: MODULE,
        svgName: 'update',
        title: 'Scheduled Tasks',
        subtitle: 'Manage the scheduled tasks',
        uri: 'tareas-programadas',
        isVisibleFor: u => u.rol == "1"
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministracionGeneralRoutingModule {
}
