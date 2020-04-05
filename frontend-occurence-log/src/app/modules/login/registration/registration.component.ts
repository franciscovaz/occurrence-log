import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ApiRequestsService } from 'src/app/shared/api-requests.service';
import { MustMatch } from 'src/app/shared/must-match.validator';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  faSignInAlt = faSignInAlt;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private restApi: ApiRequestsService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: [''],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    },
    {
      validators: MustMatch('password', 'confirm_password')
    });
  }

// convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  register(registerValue){
    this.submitted = true;

    //stop here if form is invalid
    if(this.registerForm.invalid) {
      return;
    } else {
      // TODO verificar se email ja existe na BD 
      this.restApi.getEmailAtLogin(registerValue.email).subscribe( resp => {
        if(!resp[0]){
          // Não está registado!
          if(registerValue.phone === '')
            registerValue.phone = '0';
          this.restApi.addUser(registerValue.name, registerValue.email, registerValue.phone, registerValue.password).subscribe( res => {
            sessionStorage.setItem('nome_utilizador', registerValue.name);
            sessionStorage.setItem('email_utilizador', registerValue.email);
            sessionStorage.setItem('tipo_utilizador', '4');
            this.toastr.success('', 'Registado com sucesso!');
            this.router.navigate(['/']);
          }) 
        }else {
          this.toastr.error('', 'Utilizador já registado!');
        }
      })
      
    }
  } 

}
