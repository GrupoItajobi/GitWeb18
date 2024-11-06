import { Injectable, OnInit } from '@angular/core';
import { MenuGestao } from '../../models/menu/MenuGestao';
import { MenuModulo } from '../../models/menu/MenuModulo';
import { MenuTipo } from '../../models/menu/MenuTipo';
import { MenuApp } from '../../models/menu/MenuApp';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService implements OnInit {

  menuGestao$: MenuGestao[] = [];
  menuModulo$: MenuModulo[] = [];
  menuTipo$: MenuTipo[] = [];
  menuApp$: MenuApp[] = [];

  menuGestaoSelected$?: MenuGestao;
  menuModuloSelected$?: MenuModulo;
  menuTipoSelected$?: MenuTipo;
  menuAppSelected$?: MenuApp;

  url: string;

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/menu';
  }

  ngOnInit(): void {
  }


  get menuGestao() {
    return this.menuGestao$;
  }

  get menuModulo() {
    return this.menuModulo$;
  }

  get menuTipo() {
    return this.menuTipo$;
  }

  get menutApp() {
    return this.menuApp$;
  }

  menuGestaoSelected(selected: MenuGestao) {
    this.clearMenuModulo();
    this.menuGestaoSelected$ = selected;
  }
  menuModuloSelected(selected: MenuModulo) {
    this.clearMenuTipo();
    this.menuModuloSelected$ = selected;
  }
  menuTipoSelected(selected: MenuTipo) {
    this.clearMenuApp()
    this.menuTipoSelected$ = selected;
  }
  menuAppSelected(selected: MenuTipo) {
    this.menuAppSelected$ = selected;
  }


  async preencherMenuGestao() {
    if (this.menuGestao$.length == 0) {
      await this.apiBuscarMenuGestao();
    }
  }

  async preencherMenuModulo() {
    await this.apiBuscarMenuModulo(this.menuGestaoSelected$?.id!);
  }

  async preencherMenuTipo() {
    this.menuTipo$ = [
      { id: 'M', descricao: "Manutenção" },
      { id: 'D', descricao: "Digitação" },
      { id: 'P', descricao: "Processo" },
      { id: 'C', descricao: "Consulta" },
      { id: 'I', descricao: "Interface" },
    ];
  }
  async preencherMenuApp() {
    await this.apiBuscarMenuApp(this.menuModuloSelected$?.id!, this.menuTipoSelected$?.id!);
  }

  clear() {
    this.menuGestaoSelected$ = {}
    this.clearMenuModulo()
  }
  public clearMenuGestao() {
    this.menuGestao$ = [];
    this.menuGestaoSelected$ = {}
    this.clearMenuModulo()
  }
  private clearMenuModulo() {
    this.menuModulo$ = [];
    this.menuModuloSelected$ = {};
    this.clearMenuTipo();
  }
  private clearMenuTipo() {
    this.menuTipo$ = [];
    this.menuTipoSelected$ = {};
    this.clearMenuApp();
  }
  private clearMenuApp() {
    this.menuApp$ = [];
    this.menuAppSelected$ = {};
  }

  async apiBuscarMenuGestao() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<MenuGestao[]>(`${this.url}/gestao`, { headers }))
      .then(data => {
        this.menuGestao$ = data;
        return data;
      })
      .catch(erro => {
        return erro;
      });
  }

  async apiBuscarMenuModulo(idGestao: string) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');


    return await firstValueFrom(
      this.http.get<MenuModulo[]>(`${this.url}/modulo?gestao=${idGestao}`, { headers }))
      .then(data => {
        this.menuModulo$ = data;
        return data;
      })
      .catch(erro => {
        return erro;
      });
  }

  apiBuscarMenuTipo() {
    this.preencherMenuTipo();
    return this.menuTipo$;
  }
  async apiBuscarMenuApp(idModulo: string, idTipo: string) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<MenuApp[]>(`${this.url}/app?modulo=${idModulo}&tipo=${idTipo}`, { headers }))
      .then(data => {
        this.menuApp$ = data;
        return data;
      })
      .catch(erro => {
        return erro;
      });
  }


  async apiExcluirModulo(moduloId: string): Promise<any> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    return await firstValueFrom(
      this.http.delete<any>(`${this.url}/modulo/${moduloId}`, { headers }))
      .then(data => {
        return data;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async apiSalvarModulo(modulo: MenuModulo): Promise<MenuModulo> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(modulo);


    if (modulo.id) {
      // alterar
      return await firstValueFrom(
        this.http.put<MenuApp>(`${this.url}/modulo/${modulo.id}`, body, { headers }))
        .then(data => {
          return data;
        })
        .catch(error => {
          return Promise.reject(error);
        });

    } else {
      // incluir
      return await firstValueFrom(
        this.http.post<MenuApp>(`${this.url}/modulo`, body, { headers }))
        .then(data => {
          return data;
        })
        .catch(error => {
          return Promise.reject(error);
        });
    }

  }
}

