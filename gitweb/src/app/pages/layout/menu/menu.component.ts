import { ErrorHandleService } from './../../../services/error-handle/error-handle.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MenuGestao } from '../../../models/menu/MenuGestao';
import { MenuModulo } from '../../../models/menu/MenuModulo';
import { MenuTipo } from '../../../models/menu/MenuTipo';
import { MenuApp } from '../../../models/menu/MenuApp';
import { MenuService } from '../../../services/menu/menu.service';
import { UrlService } from '../../../services/url/url.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [TableModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

  @Output() selecionouApp = new EventEmitter();
  menuGestaoSelected?: MenuGestao;
  menuModuloSelected?: MenuModulo;
  menuTipoSelected?: MenuTipo;
  menuAppSelected?: MenuApp;

  constructor(
    public menuService: MenuService,
    public urlService: UrlService,
    private router: Router,
    private errorHandleService: ErrorHandleService,
  ) {
  }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    await this.menuService.preencherMenuGestao();
    this.prencherSelecteds();
  }

  private prencherSelecteds() {
    this.menuGestaoSelected = this.menuService.menuGestaoSelected$
    this.menuModuloSelected = this.menuService.menuModuloSelected$
    this.menuTipoSelected = this.menuService.menuTipoSelected$
    this.menuAppSelected = this.menuService.menuAppSelected$
  }
  get menuGestao() {
    return this.menuService.menuGestao;
  }

  get menuModulo() {
    return this.menuService.menuModulo;
  }

  get menuTipo() {
    return this.menuService.menuTipo$;
  }

  get menuApp() {
    return this.menuService.menuApp$;
  }


  onRowSelectGestao(event: any) {
    this.menuService.menuGestaoSelected(this.menuGestaoSelected!);
    this.clearMenuModulo();
    this.menuService.preencherMenuModulo()
  }
  onRowSelectModulo(event: any) {
    this.menuService.menuModuloSelected(this.menuModuloSelected!);
    this.clearMenuTipo();
    this.menuService.preencherMenuTipo();
  }

  onRowSelectTipo(event: any) {
    this.menuService.menuTipoSelected(this.menuTipoSelected!);
    this.clearMenuApp();
    this.menuService.preencherMenuApp()
  }
  async onRowSelectApp(event: any) {
    this.menuService.menuAppSelected(this.menuAppSelected!);
    await this.urlService.permissaoParaoApp(this.menuAppSelected!)
      .then(request => {
        this.onRowUnselectApp("")
        this.selecionouApp.emit("")
        this.router.navigate([request.routerLink]);

      })
      .catch(error => this.errorHandleService.handle(error))

  }

  onRowUnselectGestao(event: any) {
    this.menuService.menuGestaoSelected(this.menuGestaoSelected!);
  }
  onRowUnselectModulo(event: any) {
    this.menuService.menuModuloSelected(this.menuModuloSelected!);
  }

  onRowUnselectTipo(event: any) {
    this.menuService.menuTipoSelected(this.menuTipoSelected!);
  }

  onRowUnselectApp(event: any) {
    console.log('onRowUnselectApp')
    console.log(event.data)
    this.menuAppSelected = event.data;
    this.menuService.menuAppSelected(this.menuAppSelected!);
    this.urlService.permissaoParaoApp(this.menuAppSelected!)

  }


  private clearMenuModulo() {
    this.menuModuloSelected = {};
    this.clearMenuTipo();
  }
  private clearMenuTipo() {
    this.menuTipoSelected = {};
    this.clearMenuApp();
  }
  private clearMenuApp() {
    this.menuAppSelected = {};
  }
}
