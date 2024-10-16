import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario/Usuario';
import { JwtHelperService } from '@auth0/angular-jwt';

const TAG_TOKEN = "token-git";

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  private jwtPayload!: any;
  private token!: string | null;


  constructor(
    private jwtHelperService: JwtHelperService,
  ) { }

  usuarioLogado(): Usuario {
    let usuario:Usuario={}
    if (this.jwtPayload) {
       usuario = {
        login: this.jwtPayload.sub,
        nome: this.jwtPayload.name
      }
    }
    return usuario;
  }

  versaoApp():string {
    return this.jwtPayload.versaoApp;
  }
  clear(): void {
    window.sessionStorage.clear();
    window.localStorage.clear();
    localStorage.removeItem(TAG_TOKEN);
    this.readTokenFromStorage();
  }


  public armazenarToken(token: string) {
    this.writeTokentoStorage(token)
  }

  // public carregarLink() {

  // }
  public carregarToken() {
    // console.log('storage.service carregarToken');
    const token = this.readTokenFromStorage();
    if (token) {
      this.armazenarToken(token)
    }
  }
  private readTokenFromStorage(): string | null {
    let token = localStorage.getItem(TAG_TOKEN);
    this.jwtPayload = {}
    if (this.tokenIsNotNull(token)) {
      this.jwtPayload = this.jwtHelperService.decodeToken(token!);
      this.token = token;
    }
    return token;
  }

  public getAccesToken(): string | null {
    return this.token;
  }

  private writeTokentoStorage(token: string) {
    if (this.tokenIsNotNull(token)) {
      this.token = token;
      localStorage.setItem(TAG_TOKEN, token);
      this.jwtPayload = this.jwtHelperService.decodeToken(token);
    }
  }

  private tokenIsNotNull(token: string | null) {
    return (token && token != 'undefined')
  }

}

