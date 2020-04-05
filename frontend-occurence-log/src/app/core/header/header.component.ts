import { Component, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/modules/login/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navbarOpen = false;
  faUser = faUser;
  public setTokenNull;

  isLoggedIn$: Observable<boolean>;



  constructor(private authService: AuthService) { }

  ngOnInit() {
     this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  logOut(){
    //REMOVER TOKEN E OUTROS DADOS
    localStorage.setItem('token', '');
    sessionStorage.setItem('id_utilizador', '');
    sessionStorage.setItem('nome_utilizador', '');
    sessionStorage.setItem('email_utilizador', '');
    sessionStorage.setItem('tipo_utilizador', '');
    localStorage.clear();

    this.authService.logout();

  }

 

}
