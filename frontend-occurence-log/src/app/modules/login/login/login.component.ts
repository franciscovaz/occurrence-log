import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ApiRequestsService } from 'src/app/shared/api-requests.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  faSignInAlt = faSignInAlt;


  constructor( private formBuilder: FormBuilder,
    private router: Router,
    private restApi: ApiRequestsService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

  }


  login(loginValue) {

    if(loginValue.email === '' && loginValue.password === ''){
      this.toastr.error('', 'Insira um email e password!');
    } else if(loginValue.email === ''){
      this.toastr.error('', 'Insira um email!');
    } else if(loginValue.password === ''){
      this.toastr.error('', 'Insira uma password!');
    }else {
      this.authService.fazerLogin(loginValue.email, loginValue.password);
    }

  }
  
}