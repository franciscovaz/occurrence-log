import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
let UserManagementComponent = class UserManagementComponent {
    constructor(formBuilder, restApi) {
        this.formBuilder = formBuilder;
        this.restApi = restApi;
        this.submitted = false;
        this.nome = '';
        this.email = '';
        this.n_telemovel = '';
    }
    ngOnInit() {
        this.managementForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required]
        });
        // TODO pass ID from session storage 
        this.restApi.getInformacaoPessoal(3).subscribe(resp => {
            console.log('Personnal info: ', resp);
            this.nome = resp[0].nome_utilizador;
            this.email = resp[0].email_utilizador;
            this.n_telemovel = resp[0].telemovel_utilizador;
            this.managementForm.setValue({ name: this.nome, email: this.email, phone: this.n_telemovel });
        });
    }
    get f() { return this.managementForm.controls; }
    updateUserInfo(info) {
        this.submitted = true;
        console.log('INFO: ', info);
        if (this.managementForm.valid) {
            console.log('Valido');
            this.restApi.updateInformacaoPessoal('3', info.name, info.email, info.phone).subscribe(resp => {
                console.log('RESPOSTA: ', resp);
            });
        }
        else {
            console.log('INVÁLIDO');
        }
    }
};
UserManagementComponent = tslib_1.__decorate([
    Component({
        selector: 'app-user-management',
        templateUrl: './user-management.component.html',
        styleUrls: ['./user-management.component.scss']
    })
], UserManagementComponent);
export { UserManagementComponent };
//# sourceMappingURL=user-management.component.js.map