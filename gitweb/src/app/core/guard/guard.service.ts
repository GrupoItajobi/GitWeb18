import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { ErrorHandleService } from './../../services/error-handle/error-handle.service';
import { ToastService } from './../../services/toast/toast.service';
import { UrlService } from './../../services/url/url.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(
    public router: Router,
    private urlService: UrlService,
    private errorHandleService: ErrorHandleService,
    private toastService: ToastService
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {

    return await this.verificarAcessoNaUrl(state.url)
      .then(response => {
        if (this.urlService.hasRole()) {
          return true;
        }
        this.router.navigate(['/home']);
        this.toastService.showInfoMsg("Acesso não Liberado!")
        return false;
      })
      .catch(error => {
        this.errorHandleService.handle(error);
        this.router.navigate(['/home']);
        return false;
      });

  }

  async verificarAcessoNaUrl(url: string): Promise<boolean> {
    return await this.urlService.permissaoParaoLink(url)
      .then(response => {
        if (this.urlService.hasRole()) {
          return true;
        }
        return false
      })
      .catch(error => {
        console.log(error)
        Promise.reject(error)
        return false
      });
  }
}
