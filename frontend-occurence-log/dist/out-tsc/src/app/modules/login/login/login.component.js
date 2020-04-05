import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
let LoginComponent = class LoginComponent {
    constructor(formBuilder, router) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.faSignInAlt = faSignInAlt;
    }
    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }
    login(loginValue) {
        console.log('Login: ', loginValue);
        // TODO API para ver se email está na BD
        // Se sim
        // API para ver se a password corresponde ao email
        // se corresponder, faz o redirect
        // se não, mensagem: senha errada
        // Se não, mensagem: utilizador nao registado
        this.router.navigate(['op/registo']);
    }
};
LoginComponent = tslib_1.__decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.scss']
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map