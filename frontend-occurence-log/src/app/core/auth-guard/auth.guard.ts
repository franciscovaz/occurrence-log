import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/login/auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private authService: AuthService,
    private router: Router){
  }

  /* canActivate() {
    if ( localStorage.getItem('token'))  {
      return true; // all fine
    } else {
      this.router.navigate(['/']);
    }
  }
  
} */

   canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.authService.isLoggedIn
      .pipe(
        take(1),
        map((isLoggedIn: boolean) => {
          if(!isLoggedIn) {
          this.router.navigate(['/']);
          return false;
        }else {
          return true; 
        }
        
      })
    )
  } 



  }
