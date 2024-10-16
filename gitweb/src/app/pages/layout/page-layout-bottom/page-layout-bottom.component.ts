import { environment } from '../../../../environments/environment';
import { StorageService } from './../../../services/storage/storage.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-page-layout-bottom',
  standalone: true,
  imports: [],
  templateUrl: './page-layout-bottom.component.html',
  styleUrl: './page-layout-bottom.component.scss'
})
export class PageLayoutBottonComponent {

  constructor(
    private storageService: StorageService

  ) { }

  versaoApi() {
    return this.storageService.versaoApp();
  }
  versaoFront() {
    return environment.versaoApp;
  }
}
