import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ToastService } from '../toast/toast.service';

import { environment } from '../../../environments/environment';

import { Ged } from '../../models/ged/ged';
import { FileInfo } from '../../models/ged/FileInfo';

@Injectable({
  providedIn: 'root'
})
export class GedService {

  files: any[] = [];
  filesNew: FileInfo[] = [];
  url: string;
  foto!: string;

  constructor(
    private http: HttpClient,
    private toastMessageService: ToastService
  ) {
    this.url = environment.apiUrl + 'GIt-api/ged/';
  }



  ngOnInit(): void {

  }


  async downloadGedPorRow(tableName: string, tabelaId: string): Promise<Ged[]> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    const params = new HttpParams()
      .set('tabelaNome', tableName)
      .set('tabelaId', tabelaId)

    return await firstValueFrom(
      this.http.get<Ged[]>(`${this.url}buscar-de-um-registro`, { headers, params }))
      .then(data => {
        return data;
      })
      .catch(erro => {
        return erro;
      });
  }


  async upLoadFoto(fileInfo:FileInfo, file: any): Promise<any> {
    const headers = new HttpHeaders()
    .append("Content-type", "text/plain")

    const params = new HttpParams()
      .set('tabelaNome', fileInfo.tabelaNome!)
      .set('tabelaId', fileInfo.tabelaId!)
      .set('tabelaIdTitulo', fileInfo.tabelaIdTitulo!)
      .set('extensao',fileInfo.extensao!)

    const body = file;

    console.log('enviando foto')
    return await firstValueFrom(
      this.http.post<any>(`${this.url}upload2`, body, { headers, params }))
      .then(data => {
        return data;
      })
      .catch(erro => {
        Promise.reject(erro);
      });
  }
}

