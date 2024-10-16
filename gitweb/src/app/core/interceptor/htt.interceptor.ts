import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, NEVER, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HttpHandle401ErrorService } from './http-handle-401-error.service';
import { ErrorHandleService } from '../../services/error-handle/error-handle.service';
import { ToastService } from '../../services/toast/toast.service';


export const httInterceptor: HttpInterceptorFn = (req, next) => {

  let refreshToken: boolean = false;
  const auth = inject(AuthService);
  const router = inject(Router);
  const errorHandle = inject(ErrorHandleService);

  if (req.url.match('refreshToken')) {
    refreshToken = true;
  }
  auth.startRefresh();
  let token = auth.accessToken();
  let clonedReq = req.clone({
    setHeaders: {
      Authorization: `${token}`
    },
    withCredentials: true
  });

  return next(clonedReq).pipe(

    catchError((err: any) => {
      // console.log(err.error)
      if (err instanceof HttpErrorResponse) {

        if (refreshToken) {
          console.log('é refreshToken e deu erro');
          console.log(err)
        }
        if (err.status === 401) {
          router.navigate(['/login']);
        } if (err.status === 403) {
          router.navigate(['/login']);
        // } if (err.status === 400) {
        //   errorHandle.handle(err);
        // } if (err.status === 404) {
        //   errorHandle.handle(err);
        // } else {
        //   errorHandle.handle(err);

        }
      // } else {
      //   errorHandle.handle(err);
      }
      return Promise.reject(err);
      return throwError(() => err);

    })

  );
};
