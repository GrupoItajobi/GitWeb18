import { Component, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast/toast.service';
import { MuralService } from '../../services/mural/mural.service';
import { UrlService } from '../../services/url/url.service';
import { AuthService } from '../../core/auth/auth.service';
import { UnidadesComponent } from '../../components/unidades/unidades/unidades.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GalleriaModule, UnidadesComponent, ToastModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  images: any[] | undefined;
  responsiveOptions: any[] | undefined;

  constructor(
    private photoService: MuralService,
    private authService: AuthService,
    private toastMessageService: ToastService,
    private urlService: UrlService,
    private router: Router) { }

  ngOnInit() {
    this.urlService.clear();
    this.images = this.photoService.getImages();
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 5
      },
      {
        breakpoint: '768px',
        numVisible: 3
      },
      {
        breakpoint: '560px',
        numVisible: 1
      }
    ];
  }
  selecionouUnidade(unidade: any) {

  }


  painelMoagem() {
    this.router.navigate(['/industria/painel/painel-producao']);
    // console.log('menuProducao alterar');
    /*
    if (!this.authService.isLogged()) {
      this.toastMessageService.showInfoMsg("Usuário não conectado!");
    } else {
      this.router.navigate(['/intranet/painel/painel-moagem']);
    }
    */
  }


  painelCarregamento() {
    if (!this.authService.isLogged()) {
      this.toastMessageService.showInfoMsg("Usuário não conectado!");
    } else {
      this.router.navigate(['/faturamento/painel-carreg-produto']);
    }
  }
  mural() {
    console.log('menuProducao');
    if (!this.authService.isLogged()) {
      this.toastMessageService.showInfoMsg("Usuário não conectado!");
    } else {
      this.router.navigate(['/intranet/mural/editar-mural']);
    }
  }
  menuAprovacao() {
    console.log('menuAprovacao');

    if (!this.authService.isLogged()) {
      this.toastMessageService.showInfoMsg("Usuário não conectado!");
    } else {
      this.router.navigate(['/painel-aprovacao']);
    }

  }
}
