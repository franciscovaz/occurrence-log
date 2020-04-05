import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiRequestsService } from 'src/app/shared/api-requests.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  managementForm: FormGroup;
  submitted = false;
  nome='';
  email='';
  n_telemovel='';

  constructor(private formBuilder: FormBuilder,
    private restApi: ApiRequestsService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {

    this.managementForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required]
    });

    // TODO pass ID from session storage 
    this.restApi.getInformacaoPessoal(sessionStorage.getItem('id_utilizador')).subscribe( resp => {
      // console.log('Personnal info: ', resp);
      this.nome = resp[0].nome_utilizador;
      this.email = resp[0].email_utilizador;
      this.n_telemovel = resp[0].telemovel_utilizador;
      this.managementForm.setValue({name: this.nome, email: this.email, phone: this.n_telemovel});
    },
    error =>{
      this.toastr.error('Sessão expirada!');
      this.router.navigate(['/']);
    }
    )

  }

get f() { return this.managementForm.controls; }

  updateUserInfo(info){
    this.submitted = true;
    if(this.managementForm.valid){
     this.restApi.updateInformacaoPessoal(sessionStorage.getItem('id_utilizador'), info.name, info.email, info.phone).subscribe( resp => {
       this.toastr.success('', 'Dados atualizados com sucesso!');
     },
     error => {
       this.toastr.error('', 'Não foi possível atualizar a informação');
     }
     )
    }else{
      this.toastr.error('', 'Faltam dados!');
    }
  }

}
