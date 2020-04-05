import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiRequestsService } from 'src/app/shared/api-requests.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private loggedIn = new BehaviorSubject<boolean>(this.tokenAvailable());

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }


  constructor(private router: Router,
    private restApi: ApiRequestsService,
    private toastr: ToastrService) { }



  fazerLogin(email, password){

    this.restApi.getEmailAtLogin(email).subscribe( resp => {
      if(Array.isArray(resp) && resp.length){
        // email existe 
        this.restApi.getEmailAndPaswoordAtLogin(email, password, resp[0].password_utilizador).subscribe( res => {
          // password e email correspondem
          if(res){
            console.log('Res: ', res );
            sessionStorage.setItem('id_utilizador', resp[0].id_utilizador);
            sessionStorage.setItem('nome_utilizador', resp[0].nome_utilizador);
            sessionStorage.setItem('email_utilizador', resp[0].email_utilizador);
            sessionStorage.setItem('tipo_utilizador', resp[0].fk_tipo_utilizador);

            // GET TOKEN

            this.restApi.getTokenAfterLogin(email, resp[0].id_utilizador).subscribe( (res) => {
              if(res['token']) {
                localStorage.setItem('token', res['token']);

            this.toastr.success('','Login com sucesso!', {
              positionClass: 'toast-top-center' 
            });   
            this.loggedIn.next(true);   
            this.router.navigate(['op/registo']); 
              }
            },
            (err) => {
              // console.log('Erro da resposta da token: ', err)
            }
            );

          }else {
            this.toastr.error('', 'Password Incorreta!', {
              positionClass: 'toast-top-center'
            });
          }
        })
      } else{
          // email nao registado
          this.toastr.error('', 'O email não se encontra registado!');
          
      }
    });
  }


logout() {
  this.loggedIn.next(false);
  this.router.navigate(['/']);
}

tokenAvailable(): boolean{
  return !!localStorage.getItem('token');
}

}
