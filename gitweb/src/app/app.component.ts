import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { PageLayoutTopComponent } from "./pages/layout/page-layout-top/page-layout-top.component";
import { StorageService } from './services/storage/storage.service';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/auth/auth.service';
import { PageLayoutBottonComponent } from "./pages/layout/page-layout-bottom/page-layout-bottom.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PageLayoutTopComponent,
    ToastModule,
    PageLayoutBottonComponent,
    PageLayoutBottonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'gitweb';
  // private authService = Inject(AuthService);
  // private storageService = Inject(StorageService);

  openApp: number = 0;
  constructor(
    public authService: AuthService,
    public storageService: StorageService,
    public router: Router) {
  }

  ngOnInit(): void {
    console.log('Start session :' + (++this.openApp));
    this.storageService.carregarToken();
    this.authService.usuarioLogado();

    if (this.authService.isLogged()) {
      this.authService.startRefresh();
    }
  }
  ngOnDestroy(): void {
    this.authService.stopRefresh();
    console.log('Stop session :' + (--this.openApp));
  }

}
