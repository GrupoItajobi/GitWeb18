import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MenuApp } from '../../models/menu/MenuApp';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class UrlService {

  public aplicacao: InfoAplicacao = {} as InfoAplicacao;
  public roleTags = new Map<string, string>();
  public role!: string;

  url: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
  ) {
    this.url = environment.apiUrl + 'GIt-api/aplicacao/regras-de-acesso';
  }
  public aplicacaoEmUso() {
    return this.aplicacao;
  }

  clear() {
    this.aplicacao = {} as InfoAplicacao;
    this.clearRole()
  }
  clearRole() {
    this.role = "";
    this.roleTags = new Map<string, string>();
  }
  async permissaoParaoLink(link: string): Promise<any> {
    let menuApp: MenuApp = { descricao: "", link: link, publico: 'N' };

    return await this.permissaoParaoApp(menuApp)
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error)
      })
  }

  async permissaoParaoApp(menuApp: MenuApp): Promise<any> {
    if (menuApp) {
      this.aplicacao = { titulo: menuApp!.descricao!, routerLink: menuApp!.link!, publico: menuApp!.publico!, ordem: 0 };
      return await this.roleAplicacao(this.aplicacao)
        .then(response => {
          return this.aplicacao;
        })
        .catch(erro => {
          this.aplicacao = {} as InfoAplicacao;
          return Promise.reject(erro);
        });
    }

  }


  async intranet(): Promise<InfoAplicacao> {
    this.aplicacao = { titulo: "Intranet", routerLink: "/intranet", publico: 'S', ordem: 0 };
    // await this.roleAplicacao(this.aplicacao);
    return this.aplicacao;
  }



  public login(): InfoAplicacao {
    this.aplicacao = { titulo: "Login", routerLink: "/intranet/login", publico: 'S', ordem: 0 };
    return this.aplicacao;
  }

  hasRole(): boolean {
    if (this.role) {
      return true;
    }
    return false;
  }
  public listaTags(): Map<string, string> {
    return this.roleTags;
  }

  async roleAplicacao(info: InfoAplicacao): Promise<any> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    this.role = "";
    this.roleTags.clear();

    return await firstValueFrom(
      this.http.get<any>(`${this.url}?link=${info.routerLink}`, { headers }))
      .then(data => {
        this.aplicacao.titulo = data.appDescricao;
        this.role = data.role;
        data.tags.forEach((key: string) => {
          this.roleTags.set(key.toLowerCase(), key);
        });
        return data;
      })
      .catch(erro => {
        return erro;
      });
  }


}
export interface InfoAplicacao {
  titulo?: string,
  routerLink?: string,
  publico?: string,
  ordem?: number,
}
