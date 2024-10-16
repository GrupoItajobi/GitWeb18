import { HttpHandler, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { throwError } from 'rxjs';

// const auth = inject(AuthService);
// const storage = inject(StorageService);

@Injectable({
  providedIn: 'root'
})
export class HttpHandle401ErrorService {


  constructor(
    private auth: AuthService,
    private storage: StorageService
  ) { }

  // handle401(request: HttpRequest<any>) {
  async handle401(request: HttpRequest<any>, next: HttpHandlerFn) {
    // handle401(next: HttpHandler) {
    console.log('entrei service HttpHandle401ErrorService')
    if (this.storage.usuarioLogado()) {
      return await this.auth.refreshToken()
        .then((token) => {
          console.log('token refresh service hht401')
          this.storage.armazenarToken(token.accessToken!);
          return next(request);
        })
        .catch(error => {
          console.log('ERRO token refresh service hht401')
          return throwError(() => error);
        })
    }
    return throwError(() => " ERRO BUSCANDO REFRESH TOKEN");
  }
}
