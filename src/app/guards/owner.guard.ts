import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerGuard implements CanActivate {
  
 constructor(private readonly tokenService:TokenService,private readonly router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.tokenService.isUserLoggedIn() && this.tokenService.isOwnerLoggedIn()) {
      return true;
    } 
    this.router.navigate(['/']);
    return false;
  }
}
