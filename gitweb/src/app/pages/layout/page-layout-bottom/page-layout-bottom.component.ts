import { NavigationEnd, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { StorageService } from './../../../services/storage/storage.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-page-layout-bottom',
  standalone: true,
  imports: [],
  templateUrl: './page-layout-bottom.component.html',
  styleUrl: './page-layout-bottom.component.scss',
})
export class PageLayoutBottonComponent {

  constructor(private storageService: StorageService, private router: Router) {}

  ngOnInit() {
    this.rotaAtual();
  }

  versaoApi() {
    return this.storageService.versaoApp();
  }
  versaoFront() {
    return environment.versaoApp;
  }

  // Verifica rota atual...
  rotaAtual() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.verificaRota();
      }
    });
  }

  // Verifica se a rota é /home para atribuir um valor na variavel.
  verificaRota() {
    if (this.router.url == '/home') {
    } else {
    }
  }
}
