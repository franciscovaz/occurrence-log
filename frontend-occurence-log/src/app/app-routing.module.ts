import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth-guard/auth.guard';


const routes: Routes = [
   {
    path: 'op', loadChildren: () => import(`./modules/user/user.module`).then(m => m.UserModule), canActivate: [AuthGuard]
  }, 
  {
    path: '', loadChildren: () => import(`./modules/login/login.module`).then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
