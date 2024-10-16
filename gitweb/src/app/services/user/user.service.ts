import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../models/usuario/Usuario';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {

  private url: string = "";
  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.apiUrl + 'GIt-api/usuario';
  }


  ngOnInit(): void {

  }


  async apiBuscarUsuarios(): Promise<Usuario[]> {

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    return await firstValueFrom(
      this.http.get<Usuario[]>(`${this.url}`, { headers }))
      .then(response => {
        return response;
      })
      .catch(error => {
        return Promise.reject(error)
      });

  }
}
