import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../core/services/auth.service';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AuthResponse } from '../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    NzCheckboxModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  keepLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private message: NzMessageService,
    private socialAuthService: SocialAuthService
  ) {
    this.socialAuthService.authState.subscribe((user: SocialUser) => {
      if (user) {
        this.handleGoogleLogin(user);
      }
    });
  }

  private handleGoogleLogin(user: SocialUser) {
    console.log(user);  
    this.isLoading = true;
    this.authService.loginWithGoogle(user.email, user.id).subscribe({
      next: (response) => {
        if (response.code === '200') {
          this.saveAuthData(response, user.email);
          this.message.success('Đăng nhập thành công');
          this.router.navigate(['/']);
        } else {
          this.message.error(response.message || 'Đăng nhập thất bại');
        }
      },
      error: (error) => {
        console.error('Google login failed:', error);
        this.message.error('Đăng nhập thất bại. Vui lòng thử lại sau.');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.code === '200') {
          this.saveAuthData(response);
          this.message.success(response.message || 'Đăng nhập thành công');
          this.router.navigate(['/']);
        } else {
          this.message.error(response.message || 'Đăng nhập thất bại');
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.message.error('Đăng nhập thất bại. Vui lòng thử lại sau.');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private saveAuthData(response: AuthResponse, email?: string) {
    localStorage.setItem('jwt', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    if (this.keepLoggedIn) {
      localStorage.setItem('keepLoggedIn', 'true');
    }
    if (email) {
      localStorage.setItem('googleEmail', email);
    }
  }
}
