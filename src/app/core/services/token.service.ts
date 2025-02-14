import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  sub: string;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  isTokenExpired(): boolean {
    const token = localStorage.getItem('jwt');
    if (!token) return true;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch {
      return true;
    }
  }

  getDecodedToken(): DecodedToken | null {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }
} 