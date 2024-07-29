import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceNavComponent } from '../common/workspace-nav/workspace-nav.component';
import { MatIconModule } from '@angular/material/icon';
import { ExperimentalMenuComponent } from '../common/experimental-menu/experimental-menu.component';
import { PhonePipe } from '../common/pipes/phone-pipe.component';
import { DatePipe } from '../common/pipes/date-pipe.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        WorkspaceNavComponent,
        ExperimentalMenuComponent,
        PhonePipe,
        DatePipe,
    ],
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule
    ],
    exports: [
        WorkspaceNavComponent,
        ExperimentalMenuComponent,
        PhonePipe,
        DatePipe,
    ]
})
export class DentalUiModule { }
