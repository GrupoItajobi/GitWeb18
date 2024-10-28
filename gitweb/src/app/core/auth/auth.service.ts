import { Usuario } from '../../models/usuario/Usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { StorageService } from '../../services/storage/storage.service';
import { Token } from '../../models/token/Token';
import { UsuarioAlterarSenha } from '../../models/usuario/UsuarioAlterarSenha';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ipAddress!: string;

  public link: string = "";
  private url: string;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  private refreshInterval: any = null;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private router: Router,
  ) {
    this.url = environment.apiUrl + 'GIt-api';

  }

  stopRefresh() {
    if (this.refreshInterval != null) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  startRefresh() {
    if (this.isLogged()) {
      if (this.refreshInterval == null) {
        this.refreshInterval = setInterval(() => {
          this.refreshToken();
        }, 1*60*60*1000);
      }
    }

  }

  public async refreshToken(): Promise<Token> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.post<Token>(`${this.url}/login/refreshToken`, { headers, withCredentials: true }))
      .then((token) => {
        console.log(new Date() + " interval: " + this.refreshInterval)
        this.storage.armazenarToken(token.accessToken!);
        return token
      })
      .catch(erro => {
        this.link = "";
        this.storage.clear();
        if (erro.status === 400 || erro.status === 401) {
          return Promise.reject("Usuario ou Senha Inválido")
        }
        if (erro.status === 0) {
          return Promise.reject(" Conexão com API Recusada ou Problemas na rede! ")
        }
        return Promise.reject("Erro Desconhecido! ")
      });
  }

  async login(login: string, password: string): Promise<Token> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    let user = ({
      login: login,
      password: password,
    })

    const body = JSON.stringify(user);

const url =this.url+'/login/signin';
console.log('url login')
console.log(url)
    return await firstValueFrom(
      this.http.post<Token>(`${url}`, body, { headers, withCredentials: true }))
      .then(token => {
        this.storage.armazenarToken(token.accessToken!);
        this.startRefresh();
        return token;
      })
      .catch(erro => {
        console.log('erro fazendo login: ')
        console.log(erro)
        this.link = "";
        this.storage.clear();
        if (erro.status === 400 || erro.status === 401) {
          return Promise.reject("Usuario ou Senha Inválido")
        }
        if (erro.status === 0) {
          return Promise.reject(" Conexão com API Recusada ou Problemas na rede! ")
        }
        return Promise.reject("Erro Desconhecido! ")
      });
  }
  public accessToken() {
    // console.log('AuthService: accessToken')
    return this.storage.getAccesToken();
  }

  public usuarioLogado(): Usuario {
    // console.log('authService usuarioLogado: '+this.storage.usuarioLogado())
    let user = this.storage.usuarioLogado();
    return user
  }

  async create(newUser: Usuario): Promise<Usuario> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(newUser);

    return await firstValueFrom(
      this.http.post<Usuario>(`${this.url}/usuario`, body, { headers }))
      .then(response => { return response; })
      .catch(erro => { return Promise.reject(erro); });
  }

  async deleteUser(userId: string): Promise<Usuario> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.delete<any>(`${this.url}/usuario/${userId}`, { headers }))
      .then(response => { return response; })
      .catch(erro => { return Promise.reject(erro); });
  }

  async resetUser(user: Usuario): Promise<Usuario> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const body = JSON.stringify(user);

    return await firstValueFrom(
      this.http.put<Usuario>(`${this.url}/usuario/reset`, body, { headers }))
      .then(response => { return response; })
      .catch(erro => { return Promise.reject(erro); });
  }






  async alterarSenha(user: UsuarioAlterarSenha) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');


    const body = JSON.stringify(user);

    return await firstValueFrom(
      this.http.put<Token>(`${this.url}/usuario`, body, { headers }))
      .then(token => {
        this.storage.armazenarToken(token.accessToken!);
        return token;
      })
      .catch(erro => {
        this.link = "";
        this.storage.clear();
        if (erro.status === 400 || erro.status === 401) {
          return Promise.reject("Usuario ou Senha Inválido")
        }
        if (erro.status === 0) {
          return Promise.reject(" Conexão com API Recusada ou Problemas na rede! ")
        }
        return Promise.reject("Erro Desconhecido! ")
      });
  }



  register(login: string, password: string): Observable<any> {
    const body = JSON.stringify({
      login,
      password,
    });
    return this.http.post(this.url + 'signin', body, this.httpOptions);
  }

  logout() {
    this.stopRefresh();
    this.storage.clear();
    this.router.navigate(['/login']);
  }

  logoutx(): Observable<any> {
    return this.http.post(this.url + 'signin', {}, this.httpOptions);
  }
  async checkIpAddress() {
    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Origin', 'http://localhost:4200');

    console.log('entrei checkIpAddress')
    return await firstValueFrom(
      this.http.get("https://api.ipify.org/?format=json"))
      .then(res => {
        console.log("======================")
        console.log(res)
        console.log("======================")
        //        this.ipAddress = res.ip;
        return;
      })
  }
  getIpAddress() {
    return this.ipAddress;
  }
  clear() {
    this.stopRefresh();
    this.storage.clear();
  }


  isLogged(): boolean {
    let usuario = this.usuarioLogado();

    if (usuario.login) { return true; }

    return false;
  }




}
