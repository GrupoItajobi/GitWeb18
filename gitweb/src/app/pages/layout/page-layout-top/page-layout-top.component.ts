import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { EmpresaService } from '../../../services/empresa/empresa.service';
import { UrlService } from '../../../services/url/url.service';

import { SidebarComponent } from "../sidebar/sidebar.component";
import { MenuComponent } from "../menu/menu.component";
import { AuthService } from '../../../core/auth/auth.service';
import { AlterarSenhaPageComponent } from '../../ti/controle-acesso/alterar-senha-page/alterar-senha-page.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-page-layout-top',
  standalone: true,
  imports: [
    CommonModule,
    OverlayPanelModule,
    SidebarComponent,
    SidebarComponent,
    MenuComponent,
    AlterarSenhaPageComponent,
    ToastModule,
  ],
  templateUrl: './page-layout-top.component.html',
  styleUrl: './page-layout-top.component.scss'
})

export class PageLayoutTopComponent implements OnInit {
  sidebarVisible: boolean = false;

  dataAtual: Date = new Date();

  userItens: MenuItem[] | undefined;
  dialogAlterarSenha: boolean = false;

  // authService = inject(AuthService);
  empresaService = inject(EmpresaService);
  url = inject(UrlService);

  userLogin!: string;

  constructor(
    // public url: UrlService,
    // public empresaService: EmpresaService,
    public authService: AuthService,
    private router: Router,
  ) {
    // this.empresaHeader = this.empresaService.empresaSelecionada;
    this.dataAtual = new Date();
    setInterval(() => {         //replaced function() by ()=>
      this.dataAtual = new Date();
    }, 1000);
  }


  ngOnInit(): void {
    // this.usuarioLogado = this.authService.usuarioLogado()!;
  }

  click(par: any) {
    document.getElementById('clickMenu')?.click();
  }
  logout() {
    // this.usuarioLogado = {};
    this.authService.logout();
    this.url.clear();
  }

  login() {
    // this.usuarioLogado = {};
    this.router.navigate(['login']);
  }
  home() {
    this.router.navigate(['home']);
  }
  alterarSenha() {
    this.userLogin = this.authService.usuarioLogado().login!;
    this.dialogAlterarSenha = true;
  }
  eventSidebarClose(sidebarVisible: boolean) {
    this.sidebarVisible = sidebarVisible;
  }
  eventCloseDialog(alterarSenha: boolean) {
    this.dialogAlterarSenha = false;
  }

}
