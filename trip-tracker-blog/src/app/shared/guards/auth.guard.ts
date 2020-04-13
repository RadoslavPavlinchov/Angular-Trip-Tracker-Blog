import { AuthService } from "./../services/auth.service";
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const currentUser = this.authService.currentUser;
    if(currentUser){
      if(next.data.roles && next.data.roles.indexOf(currentUser.role) === -1){
        this.router.navigate(["/login"])
      }else{
        return true;
      }
    }
  }
}
