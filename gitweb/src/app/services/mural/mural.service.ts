import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MuralService {


  urlGed: string;
  constructor(
    private httpClient: HttpClient
  ) {
    this.urlGed = environment.ged;
  }

  getImages(): any {
    let images = [
      /* PhotoService */
      {
        itemImageSrc: `${this.urlGed}/layout/img/logo/logo.png`,
        thumbnailImageSrc: `${this.urlGed}/layout/img/logo/logo.png`,
        alt: 'Grupo Itajobi',
        title: 'Grupo Itajobi'
      },
      {
        itemImageSrc: `${this.urlGed}/mural/mes.jpg`,
        thumbnailImageSrc: `${this.urlGed}/mural/mes.jpg`,
      },

    ];
    return images;
  }


}
