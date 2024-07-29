import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-workspace-nav',
  templateUrl: './workspace-nav.component.html',
  styleUrls: ['./workspace-nav.component.css']
})
export class WorkspaceNavComponent implements OnInit {

  constructor(public utilService: UtilService) { }

  ngOnInit() {
  }

}
