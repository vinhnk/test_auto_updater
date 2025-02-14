import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_CONFIG } from '../../shared/common';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('jwt');
  // console.log(req.url);
  // console.log(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN);
  // console.log(req.url.includes(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN));
  // console.log(token);
  
  // Kiểm tra có token và không phải là request refresh token
  if (token && !req.url.includes(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN)) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const keepLoggedIn = localStorage.getItem('keepLoggedIn');
        if (keepLoggedIn) {
          return authService.refreshToken().pipe(
            switchMap((response) => {
              localStorage.setItem('jwt', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.data.accessToken}`
                }
              });
              return next(clonedReq);
            }),
            catchError(() => {
              handleLogout(router);
              return throwError(() => error);
            })
          );
        } else {
          handleLogout(router);
        }
      }
      return throwError(() => error);
    })
  );
};

function handleLogout(router: Router): void {
  localStorage.removeItem('jwt');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('keepLoggedIn');
  localStorage.removeItem('googleEmail');
  router.navigate(['/login']);
} 