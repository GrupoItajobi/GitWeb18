import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MenuApp } from '../../models/menu/MenuApp';
import { firstValueFrom } from 'rxjs';
import { Role } from '../../models/link-seguranca/Role';
import { RoleTag } from '../../models/link-seguranca/RoleTag';
import { UsuarioRole } from '../../models/link-seguranca/UsuarioRole';

@Injectable({
  providedIn: 'root'
})
export class AcessosAplicacaoService {
  url: string;
  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/aplicacao';
  }

  async apiIncluirApp(app: MenuApp): Promise<MenuApp> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(app);

    return await firstValueFrom(
      this.http.post<MenuApp>(`${this.url}/link-de-aplicacoes`, body, { headers }))
      .then(data => {
        return data;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }


  async apiAlterarApp(app: MenuApp): Promise<MenuApp> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(app);

    return await firstValueFrom(
      this.http.put<MenuApp>(`${this.url}/link-de-aplicacoes/${app.id}`, body, { headers }))
      .then(data => {
        return data;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }


  async apiExcluirApp(app: MenuApp): Promise<boolean> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.delete<any>(`${this.url}/link-de-aplicacoes/${app.id}`, { headers }))
      .then(data => {
        return true;
      })
      .catch(erro => {
        return false;
      });
  }



  async apiBuscarRolesDoApp(linkId: string): Promise<Role[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<Role[]>(`${this.url}/regras-de-acesso/roles/${linkId}`, { headers }))
      .then(data => {

        return data;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async apiAlterarRoleRoleDoApp(role: Role): Promise<Role> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(role);

    return await firstValueFrom(
      this.http.put<Role>(`${this.url}/regras-de-acesso/role/${role.id}`, body, { headers }))
      .then(data => {

        return data;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async apiIncluirRoleDoApp(role: Role): Promise<Role> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(role);

    return await firstValueFrom(
      this.http.post<Role>(`${this.url}/regras-de-acesso/role`, body, { headers }))
      .then(data => {

        return data;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  async apiExcluirRoleRoleDoApp(role: Role): Promise<boolean> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.delete<any>(`${this.url}/regras-de-acesso/role/${role.id}`, { headers }))
      .then(data => {
        return true;
      })
      .catch(erro => {
        return false;
      });
  }



  async apiSalvarTagParaRole(tag: RoleTag): Promise<RoleTag> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(tag);

    if (!tag.id) {
      return await firstValueFrom(
        this.http.post<RoleTag>(`${this.url}/regras-de-acesso/tag`, body, { headers }))
        .then(data => {
          return data;
        })
        .catch(error => {
          return Promise.reject(error);
        });
    } else {
      return await firstValueFrom(
        this.http.put<RoleTag>(`${this.url}/regras-de-acesso/tag/${tag.id}`, body, { headers }))
        .then(data => {
          return data;
        })
        .catch(erro => {
          return erro;
        });
    }
  }


  async apiExcluirTagDaRole(tag: RoleTag): Promise<boolean> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.delete<any>(`${this.url}/regras-de-acesso/tag/${tag.id}`, { headers }))
      .then(data => {
        return true;
      })
      .catch(erro => {
        return false;
      });
  }


  async apiBuscarTagsDaRole(roleId: string): Promise<RoleTag[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<RoleTag[]>(`${this.url}/regras-de-acesso/tags/${roleId}`, { headers }))
      .then(data => {
        return data;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }


  async apiBuscarUsuariosDaRole(roleId: string): Promise<UsuarioRole[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<UsuarioRole[]>(`${this.url}/regras-de-acesso/usuarios-da-role/${roleId}`, { headers }))
      .then(data => {
        return data;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }


  // Usuario Role

  async apiIncluirUsuarioRole(login: string, roleId: string, linkId: string): Promise<UsuarioRole> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const userRole: any = {
      login: login,
      roleId: roleId,
      linkId: linkId
    };

    const body = JSON.stringify(userRole);

    console.log('apiIncluirUsuarioRole')
    console.log(body)
    return await firstValueFrom(
      this.http.post<UsuarioRole>(`${this.url}/regras-de-acesso/usuario-da-role`, body, { headers }))
      .then(data => {

        return data;
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }


  async apiExcluirUsuarioDaRole(roleUserId: String): Promise<boolean> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.delete<any>(`${this.url}/regras-de-acesso/usuario-da-role/${roleUserId}`, { headers }))
      .then(data => {
        return true;
      })
      .catch(erro => {
        return false;
      });
  }


}
