import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Disponível para toda a aplicação
})

// ***Service compartilhado***
//  Pode pegar informação de qualquer modulo e pode ser utilizado em qualquer modulo.
export class SharedDataService {
  private data: any;

  setData(value: any) {
    this.data = value;
  }

  getData() {
    return this.data;
  }
}
