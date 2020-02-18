import { AuthService } from "./../services/auth.service";
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  // canActivate(): Observable<boolean> {
  //   return this.authService.userData$.pipe(
  //     map( user => {
  //       if (!user) {
  //         this.router.navigate(['/login'])
  //         return false;
  //       }
  //       return true;
  //     })
  //   )
  // }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const currentUser = this.authService.currentUser;
    if(currentUser){
      //check if the route is retricted by role
      if(next.data.roles && next.data.roles.indexOf(currentUser.role) === -1){
        //role not authorized
        this.router.navigate(["/login"])
      
      }else{
        return true;
      }
    }
  }
}
