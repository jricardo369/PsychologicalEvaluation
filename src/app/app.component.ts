import { Component, OnInit } from '@angular/core';
import { SessionService, SessionServiceListener } from './services/session.service';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { query, trigger, transition, style, animateChild, group, animate } from '@angular/animations';
import { UtilService } from './services/util.service';

export const slideInAnimation =
    trigger('myAnimationGus', [
        transition('* => *', [
            query(
                ':enter .workspace',
                [style({
                    opacity: 0,
                    transform: 'translateX(-10px)'
                })],
                { optional: true }
            ),
            query(
                ':leave .workspace',
                [style({
                    opacity: 1,
                }),
                animate('0.1s', style({
                    opacity: 0,
                }))],
                { optional: true }
            ),
            query(
                ':enter .workspace',
                [style({
                    opacity: 0,
                    transform: 'translateX(-10px)'
                }),
                animate('0.2s', style({
                    opacity: 1,
                    transform: 'translateX(-0%)'
                }))],
                { optional: true }
            )
        ])
    ]);


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [
        slideInAnimation
    ]
})
export class AppComponent implements OnInit, SessionServiceListener {

    title = 'contelec-app';

    isRouterOutletVisible = true;

    isAppBarVisible = false;

    constructor(
        public utilService: UtilService,
        private sessionService: SessionService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private router: Router
    ) {
        [
            'menu', 'search', 'stop', 'account-circle', 'arrow-forward', 'check-box-outline-blank', 'star',
            'box', 'delete', 'refresh', 'add-box', 'oval', 'check-box', 'edit', 'more-vert','fedora-hat',
            'arrow-back', 'arrow-forward', 'person', 'security', 'done', 'done-all',
            'add', 'remove', 'airplane', 'areas', 'bar-code', 'print',
            'clasesg', 'close', 'file-upload', 'file-download', 'filter-list',
            'gi', 'group', 'remove-shopping-cart', 'report',
            'shop', 'shopping-cart', 'sort', 'tclases', 'test', 'cancel',
            'test2', 'travel', 'trolley', 'update', 'settings',
            'assignment', 'assignment-ind', 'assignment-turned-in','users','general-manage',
            'information', 'questions', 'alert', 'pending-black','to-do-list','pending-actions',
            'agenda', 'cita', 'historia', 'historial', 'pacientes', 'pago', 'pagos', 'administracion', 'users2', 'attach_file',
            'eye', 'external-link', 'scales', 'availability', 'users-report', 'payment', 'mail-sent',
            'reports', 'planning', 'closed'
        ].forEach(e => iconRegistry.addSvgIcon(e, sanitizer.bypassSecurityTrustResourceUrl(document.baseURI + '/assets/svg/' + e + '.svg')));

        //localStorage.clear();
    }

    ngOnInit(): void {
        this.sessionService.addListener(this);
        /*this.sessionService
            .isSessionValid()
            .then(isValid => {
                if (!isValid) {
                    this.isAppBarVisible = false;
                    this.router.navigateByUrl('/ingresar');
                } else { this.isAppBarVisible = true; }
            })
            .catch(reason => alert(reason))
            .then(() => this.isRouterOutletVisible = true);*/
            if (localStorage.getItem('auth_token') === null) {
                this.isAppBarVisible = false;
                //this.isRouterOutletVisible = true;
                this.router.navigateByUrl('/ingresar');
            }
            else {
                this.isAppBarVisible = true;
                //this.isRouterOutletVisible = true;
                this.router.navigateByUrl('/inicio');
            }
    }

    onIniciarSesion() {
        this.isAppBarVisible = true;
    }

    onCerrarSesion() {
        this.isAppBarVisible = false;
    }
}
