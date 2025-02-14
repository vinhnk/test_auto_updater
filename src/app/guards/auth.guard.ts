import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../core/services/token.service';
import { AuthService } from '../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  canActivate(): boolean | Promise<boolean> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      this.handleLogout();
      return false;
    }

    if (this.tokenService.isTokenExpired()) {
      const keepLoggedIn = localStorage.getItem('keepLoggedIn') === 'true';
      const refreshToken = localStorage.getItem('refreshToken');

      if (keepLoggedIn && refreshToken) {
        return new Promise((resolve) => {
          this.authService.refreshToken().subscribe({
            next: (response) => {
              if (response.code === '200') {
                localStorage.setItem('jwt', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                resolve(true);
              } else {
                this.handleLogout();
                resolve(false);
              }
            },
            error: () => {
              this.handleLogout();
              resolve(false);
            }
          });
        });
      }
      
      this.handleLogout();
      return false;
    }
    return true;
  }

  private handleLogout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
} 