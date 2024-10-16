import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MuralService {
  constructor(
    private httpClient:HttpClient
  ) {}

  getImages() :any{
    let images = [
      /* PhotoService */
      {
        // itemImageSrc: 'https://registadeu.com.br/wp-content/uploads/2018/11/Ayrton_Senna.jpg',
        itemImageSrc: 'assets/layout/img/logo/logo.png',
        thumbnailImageSrc: 'assets/layout/img/logo/logo.png',
        alt: 'Grupo Itajobi',
        title: 'Grupo Itajobi'
      },
      {
        itemImageSrc: 'assets/mural/mes.jpg',
        thumbnailImageSrc: 'assets/mural/mes.jpg',
      },
      {
        itemImageSrc: 'assets/layout/img/logo/logo.png',
        thumbnailImageSrc: 'assets/layout/img/logo/logo.png',
      },


    ];
    return images;
  }


}
